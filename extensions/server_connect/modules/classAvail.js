const {
    DateTime
} = require('luxon');
const db = require('../../../lib/core/db');
const _ = require('underscore');
const mathjs = require('mathjs');
const {
    isArray
} = require('underscore');

exports.classAvail = async function (options) {
    options = this.parse(options);
    let startdate = DateTime.fromSQL(options.weekdate).startOf('week');
    let enddate = DateTime.fromSQL(options.weekdate).endOf('week');
    // Start of week - Week starts on Sunday or Monday.
    let startofweek = options.startofweek.toLowerCase();
    if (startofweek == 'sunday') {
        startdate = startdate.minus({
            days: 1
        });
        enddate = enddate.minus({
            days: 1
        });
    }
    //////////// Database Connection //////////
    const connection = this.parseRequired('db', 'string', 'connection is required.');
    // get the database connection
    const db = this.getDbConnection(connection);
    // throw error if connection not found
    if (!db) throw new Error(`Connection "${connection}" doesn't exist.`);
    //////////// End database connection //////////

    /** Get Relevant settings from db */
    let _makeup_max_days = dbClientFlat(await db.raw(`
        SELECT value
        FROM settings
        WHERE name = 'enrol_makeup_book_ahead_days'
    `)).value;
    let _max_bookahead = dbClientFlat(await db.raw(`
        SELECT value
        FROM settings
        WHERE name = 'enrol_availability_max_weeks'
    `)).value;
    let _timezone = dbClientFlat(await db.raw(`
        SELECT value
        FROM settings
        WHERE name = 'timezone'
    `)).value;

    /** Set up dates */
    let makeup_max_date = DateTime.now().plus({
        days: _makeup_max_days
    }).setZone(_timezone);
    let enrolment_max_date = DateTime.now().plus({
        weeks: _max_bookahead
    }).setZone(_timezone);

    // Throw out of date range error if weekdate is greater than maximum enrolment date.
    let outofrange = (Number(DateTime.fromSQL(options.weekdate).toSeconds()) > Number(enrolment_max_date.toSeconds()));
    if(outofrange) {
        throw new RangeError('Date Range Error: Your chosen weekdate is further in the future than allowed. Please choose another date.')
        return
    };

    /** Get calendar settings */
    let calendar_interval = Number(dbClient(await db.raw("SELECT value FROM settings WHERE name = 'calendar_intervals'")).value);
    let calendar_starttime = Number(dbClient(await db.raw("SELECT value FROM settings WHERE name = 'class_min_time'")).value);
    let calendar_endtime = Number(dbClient(await db.raw("SELECT value FROM settings WHERE name = 'class_max_time'")).value);
    let calendar_timeslots = createCalendarTimeslots(calendar_starttime, calendar_endtime, calendar_interval);

    /** Setup Filters */
    let filtered_classes = false; // Boolean switch for filters.
    let filters = {
            "day_filter": this.parse(options.day_filter) == '' ? [] : this.parse(options.day_filter).map((i) => {
                return Number(i)
            }),
            "time_filter": this.parse(options.time_filter) == '' ? [] : this.parse(options.time_filter).map((i) => {
                return Number(i)
            }),
            "instructor_filter": this.parse(options.instructor_filter) == '' ? [] : this.parse(options.instructor_filter).map((i) => {
                return `'` + i + `'`
            }),
            "level_filter": this.parse(options.level_filter) == '' ? [] : this.parse(options.level_filter).map((i) => {
                return `'` + i + `'`
            })
        },
        filters_applied = filters.day_filter.length > 0 || filters.instructor_filter.length > 0 || filters.level_filter.length > 0 || filters.time_filter.length > 0 ? true : false,
        filtered_availabilities = options.avail_type ? true : false;

    /** Setup Pagination for Bootstrap */
    let classcount = dbClientFlat(await db.raw(`
        SELECT COUNT(c.uuid) as count
        FROM classes c
        WHERE isactive = true ${filters_applied ? `AND` : ``}
        ${filters.day_filter.length > 0 ? `c.day IN(${filters.day_filter})` : ``}
        ${filters.day_filter.length > 0 && (filters.level_filter.length > 0 || filters.instructor_filter.length > 0 || filters.time_filter.length > 0) ? `AND` : ``}
        ${filters.level_filter.length > 0 ? `c.classlevel_uuid IN(${filters.level_filter})` : ``}
        ${filters.level_filter.length > 0 && (filters.instructor_filter.length > 0 || filters.time_filter.length > 0) ? `AND` : ``}
        ${filters.instructor_filter.length > 0 ? `c.instructor_uuid IN(${filters.instructor_filter})`: ``}
        ${filters.instructor_filter.length > 0 && filters.time_filter.length > 0 ? `AND` : ``}
        ${filters.time_filter.length > 0 ? `c.startTimeDecimal IN(${filters.time_filter})`: ``}
    `)).count;
    // Set page variables.
    let limit = this.parse(options.limit),
        total = classcount,
        offset = this.parse(options.offset),
        last_offset = (total % limit) === 0 ? (total - limit) : (total - (total % limit)),
        page = {
            "total": Math.ceil((total / limit)),
            "current": ((offset + limit) / limit),
            "offset": {
                "first": 0,
                "last": (total % limit) === 0 ? (total - limit) : (total - (total % limit)),
                "next": (offset + limit) > total ? last_offset : (offset + limit),
                "prev": (offset - limit) <= 0 ? 0 : (offset - limit)
            }
        },
        next = (offset + limit) > total ? last_offset : (offset + limit),
        prev = (offset - limit) <= 0 ? 0 : (offset - limit);

    /** Classes */

    let classdump = dbClient(await db.raw(`
    SELECT c.uuid,
        c.id,
        c.uuid,
        c.startTimeDecimal,
        c.endTimeDecimal,
        c.instructor_uuid,
        c.classlevel_uuid,
        c.day AS classday,
        c.startTimeDisplay,
        c.endTimeDisplay,
        c.max,
        c.classtype_uuid,
        c.classType,
        ct.shortName,
        ct.id,
        i.id,
        cl.id

    FROM classes c LEFT JOIN classTypes ct ON c.classtype_uuid = ct.uuid LEFT JOIN staff i ON c.instructor_uuid = i.uuid LEFT JOIN classLevels cl ON cl.uuid = c.classlevel_uuid
    ${filters_applied ? `WHERE` : ``}
    ${filters.day_filter.length > 0 ? `c.day IN(${filters.day_filter})` : ``}
    ${filters.day_filter.length > 0 && (filters.level_filter.length > 0 || filters.instructor_filter.length > 0 || filters.time_filter.length > 0) ? `AND` : ``}
    ${filters.level_filter.length > 0 ? `c.classlevel_uuid IN(${filters.level_filter})` : ``}
    ${filters.level_filter.length > 0 && (filters.instructor_filter.length > 0 || filters.time_filter.length > 0) ? `AND` : ``}
    ${filters.instructor_filter.length > 0 ? `c.instructor_uuid IN(${filters.instructor_filter})`: ``}
    ${filters.instructor_filter.length > 0 && filters.time_filter.length > 0 ? `AND` : ``}
    ${filters.time_filter.length > 0 ? `c.startTimeDecimal IN(${filters.time_filter})`: ``}
    GROUP BY c.uuid, c.id, c.startTimeDecimal, c.endTimeDecimal, c.instructor_uuid, c.classlevel_uuid, c.day,
                c.startTimeDisplay, c.endTimeDisplay, c.max, c.classtype_uuid
    ORDER BY
    (CASE (SELECT value FROM settings WHERE name = 'weekstart')
        WHEN 'Sunday' THEN
            FIELD(day, 7, 1, 2, 3, 4, 5, 6)
        WHEN 'Monday' THEN
            c.day
    END),c.startTimeDecimal,cl.id, i.id
    ${filtered_availabilities ? `` : `LIMIT `+ offset+`, `+limit}
    `));

    // Start Class Details generation.
    let performance_array = [];
    for (let i = 0; i < classdump.length; i++) {
        let c = classdump[i];
        if (startofweek == 'sunday') {
            if (c.classday == 7) {
                c.weekday = DateTime.fromISO(startdate);
            } else {
                c.weekday = DateTime.fromISO(startdate).plus({
                    days: (c.classday)
                });
            }
        } else {
            c.weekday = DateTime.fromISO(startdate).plus({
                days: (c.classday - 1)
            });
        }

        c.baseRate = dbClientFlat(await db.raw(`
            SELECT cb.baserate
            FROM charges_baserates cb
            WHERE 
                '${c.weekday}' BETWEEN IFNULL(cb.effective_date,'1900-01-01') AND IFNULL(cb.end_date,'2999-01-01')
                AND cb.classlevel_uuid = '${c.classlevel_uuid}';
        `)).baserate;

        c.details = {};
        let pstart = performance.now();
        c.details = await processClass(c.weekday, c.uuid, c.max, c);
        let pend = performance.now();
        performance_array.push((pend - pstart) / 1000);
        c.waitlists = await processWaitlists(c);

        // for (let i = 0; i < c.details.enrolments.length; i++) {
        //     let e = c.details.enrolments[i];
        //     // let att = await attendance(e);
        //     // e.attendance = att || null;
        // }
    }

    // If classes are filtered, get ALL classes from SQL DB, then filter them with JS
    if (options.avail_type) {
        if (options.avail_type == 'permanent') {
            filtered_classes = _.filter(classdump, function (o) {
                let fc = (Number(o.max) - Number(o.details.total)) >= options.avail_amount;
                return fc;
            });
        } else if (options.avail_type == 'temporary') {
            filtered_classes = _.filter(classdump, function (o) {
                return Number(o.details.makeup_avail_max) >= Number(options.avail_amount);
            });
        }
    }

    if (filtered_classes) {
        page.total = Math.ceil((filtered_classes.length / limit));
    }

    return {
        'outofrange': {
            'outofrange': outofrange,
            'weekdate_seconds': Number(DateTime.fromISO(options.weekdate).toSeconds()),
            'maxdate_seconds': Number(enrolment_max_date.toSeconds()),
            'weekdate': options.weekdate
        },
        "filters": {
            "day": filters.day_filter,
            "time": filters.time_filter,
            "instructor": filters.instructor_filter,
            "level": filters.level_filter
        },
        // Paginate classes when they're filtered with slice();
        "classes": filtered_classes ? filtered_classes.slice(offset, (offset + limit)) : classdump,
        "limit": limit,
        "offset": offset,
        "page": page,
        "last_offset": last_offset,
        "prev": prev,
        "next": next,
        "total": total,
        'startofweek': startdate.toISODate(),
        'endofweek': enddate.toISODate(),
        'performance': performance_array,
        'peformance_total': performance_array.length > 0 ? performance_array.reduce((a,b) => {return a + b}) : []
    }

    /** Functions */

    function createCalendarTimeslots(starttime, endtime, interval) {
        let timeslot_array = [];
        while (starttime < endtime) {
            timeslot_array.push(starttime);
            starttime += interval;
        }
        return timeslot_array
    }

    async function processClass(weekday, class_uuid, classmax, classinfo) {
        let enrolments, 
            weekly_total_enrols = [],
            weekday_arr = [],
            enrolment_count,
            classprocess_startdate = startdate,
            classprocess_enddate = enddate,
            classprocess_weekday = weekday,
            att = [],
            absence_array = [];

        // Get enrolment counts and availabilities.
        let idx = 0;
        while(classprocess_weekday.toSeconds() <= enrolment_max_date.toSeconds()) {
            let enrolments_processed = await processEnrolments(classinfo,classprocess_weekday);
            if(idx === 0) enrolments = enrolments_processed.enrolments;
            weekly_total_enrols.push(enrolments_processed.enrolmenttotal);
            weekday_arr.push(classprocess_weekday);

            // Increment the week;
            classprocess_startdate = classprocess_startdate.plus({
                days: 7
            });
            classprocess_enddate = classprocess_enddate.plus({
                days: 7
            });
            classprocess_weekday = classprocess_weekday.plus({
                days: 7
            });
            idx += 1;
        }
        
        let mu_array_indexes = [],
            mu_avail = [],
            mu_avail_max;

        // Add makeup availability array
        for (let i = 0; i < weekly_total_enrols.length; i++) {
            if (weekly_total_enrols[i] < Number(classmax)) {
                mu_array_indexes.push(i);
            }
        }

        // Match weekdays with makeup array and check for availabilities.
        for (let i = 0; i < mu_array_indexes.length; i++) {
            if (DateTime.fromISO(weekday_arr[mu_array_indexes[i]]).toSeconds() <= makeup_max_date.toSeconds() && DateTime.fromISO(weekday_arr[mu_array_indexes[i]]).toSeconds() >= DateTime.now().setZone(_timezone).toSeconds()) {
                mu_avail.push({
                    'date': weekday_arr[mu_array_indexes[i]],
                    'availabilities': classmax - weekly_total_enrols[mu_array_indexes[i]]
                });
            }
        }

        if (mu_avail.length > 0) {
            let x = [];
            for (let i = 0; i < mu_avail.length; i++) {
                x.push(mu_avail[i].availabilities);
            }
            mu_avail_max = Math.max(...x);
        }

        // Set makeup response if no makeups available.
        mu_unavail_response = DateTime.fromISO(weekday_arr[0]).toSeconds() > makeup_max_date.toSeconds() ? mu_unavail_response = {
            "code": 102,
            "response": 'Too far into future.',
            "total": 0,
            "date": DateTime.fromISO(weekday_arr[0]).toISODate()
        } : mu_avail.length == 0 && startdate.toSeconds() < makeup_max_date.toSeconds() ? {
            "code": 101,
            "response": 'No availabilities.',
            "total": 0
        } : {
            "code": 100,
            "response": "Availabilities found.",
            "total": mu_avail_max
        };

        // Get last date with maximum students in class
        let last_max_week = weekly_total_enrols.lastIndexOf(classmax);
        let nextavailable_permanent;
        if(last_max_week == -1) {
            if(weekday_arr.length > 0 && weekday_arr[0].toSeconds() < DateTime.now().startOf('day').toSeconds()) {
                nextavailable_permanent = weekday_arr[1];
            } else {
                nextavailable_permanent = weekday_arr[0];
            }
        } else if(last_max_week + 1 == weekday_arr.length) {
            nextavailable_permanent = null
        } else {
            nextavailable_permanent = weekday_arr[last_max_week + 1];
        }

        if(nextavailable_permanent && nextavailable_permanent.toSeconds() < DateTime.fromSQL(options.weekdate).toSeconds()) {
            nextavailable_permanent = nextavailable_permanent.plus({weeks: 1})
        };

        return {
            'attendance': att,
            'absence_array': absence_array,
            'makeup_availabilities': mu_avail,
            'makeup_avail_max': mu_avail_max || null,
            'makeup_response': mu_unavail_response,
            'nextavailable_permanent': nextavailable_permanent ? nextavailable_permanent.toISODate() : false,
            'total': Math.max(...weekly_total_enrols),
            'weekday': DateTime.fromISO(weekday).toISODate(),
            'weekday_arr': weekday_arr,
            'weekly_total_enrols': weekly_total_enrols,
            'enrolments': enrolments
        };
    }

    async function processEnrolments(classinfo,date) {
        let enrolobject = {
            'active_enrols': [],
            'trial_enrols': [],
            'makeup_enrols': [],
            'casual_enrols': []
        };
        let enrolmenttotal = 0;

        let enrolments = dbClient(await db.raw(`
            SELECT
                e.uuid AS enrolment_uuid,
                e.enrolmentType,
                s.age,
                e.class_uuid,
                s.dob,
                e.dropDate,
                e.enrolmentType,
                s.family,
                s.firstName,
                e.isTransferIn,
                e.isTransferOut,
                s.lastName,
                e.startDate,
                s.uuid,
                e.transferToStart
            FROM enrolments e
                LEFT JOIN students s ON e.student_uuid = s.uuid LEFT JOIN classes c ON e.class_uuid = c.uuid
            WHERE e.isValid = 1
            AND (e.dropDate >= '${date.toISODate()}' OR e.dropDate IS NULL)
            AND c.uuid = '${classinfo.uuid}';
        `));
        // Loop and sort enrolments
        if (Array.isArray(enrolments)) {
            enrolmenttotal = enrolments.length;
            for (let i = 0; i < enrolments.length; i++) {
                switch (enrolments[i].enrolmentType) {
                    case 1:
                        enrolobject.active_enrols.push(enrolments[i])
                        break;
                    case 2:
                        enrolobject.makeup_enrols.push(enrolments[i])
                        break;
                    case 3:
                        enrolobject.trial_enrols.push(enrolments[i])
                        break;
                    case 5:
                        enrolobject.casual_enrols.push(enrolments[i])
                        break;
                }
            }
        }

        let enrolmentcount_bytype = {
            'active_enrols': enrolobject.active_enrols.length,
            'trial_enrols': enrolobject.trial_enrols.length,
            'makeup_enrols': enrolobject.makeup_enrols.length,
            'casual_enrols': enrolobject.casual_enrols.length
        }

        return {
            'enrolments': enrolobject,
            'enrolmentcount_bytype': enrolmentcount_bytype,
            'enrolmenttotal': enrolmenttotal
        };
    }
    async function processWaitlists(c) {
        // GET WAITLIST
        let waitlisted = dbClient(await db.raw(`
            SELECT w.*, s.firstName, s.lastName, s.dob, s.age, s.family, s.uuid 
            FROM waitlists w LEFT JOIN students s ON w.student_uuid = s.uuid  
            WHERE (w.endtimedec >= ${c.endTimeDecimal} 
                AND w.starttimedec <= ${c.startTimeDecimal} 
                AND w.dayint = '${c.classday}' 
                AND (w.instructor_uuid = '${c.instructor_uuid}' 
                    OR w.instructor_uuid IS NULL) 
                AND w.fulfil_date IS NULL 
                AND (w.classlevel_uuid = '${c.classlevel_uuid}'
                    OR w.classlevel_uuid IS NULL))
            ORDER BY w.request_date
        `));

        return waitlisted;
    }

    async function attendance(enrolment, classdate) {
        let att = dbClient(await db.raw(`
            SELECT *
            FROM absences a 
            WHERE 
                a.enrolment_uuid = '${enrolment.uuid}' 
                AND a.class_uuid = '${enrolment.class_uuid} 
                AND a.absence_date = ${classdate}
            ORDER BY absence_date DESC
        `));
        return att;
    }

    /** Database Utilities */
    function dbClientFlat(v) {
        if (db.client.config.client == 'mysql' || db.client.config.client == 'mysql2') {
            return v[0][0];
        } else if (db.client.config.client == 'postgres' || db.client.config.client == 'redshift') {
            return v = v.rows;
        }
    }

    function dbClient(v) {
        if (db.client.config.client == 'mysql' || db.client.config.client == 'mysql2') {
            return v[0];
        } else if (db.client.config.client == 'postgres' || db.client.config.client == 'redshift') {
            return v = v.rows;
        }
    }
}