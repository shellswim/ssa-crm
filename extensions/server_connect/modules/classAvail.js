const {
    DateTime
} = require('luxon');
const db = require('../../../lib/core/db');
const _ = require('underscore');
const mathjs = require('mathjs');

exports.classAvail = async function (options) {
    options = this.parse(options);
    let show_full_classes = Boolean(Number(options.show_full_classes));
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
    let _max_bookahead_eow_push = dbClientFlat(await db.raw(`
        SELECT value
        FROM settings
        WHERE name = 'enrol_availability_end_of_week'
    `)).value;
    let _timezone = dbClientFlat(await db.raw(`
        SELECT value
        FROM settings
        WHERE name = 'timezone'
    `)).value;

    /** Set up dates */
    let makeup_max_date = DateTime.now().setZone(_timezone).plus({
        days: (Number(_makeup_max_days) - 1)
    });
    let enrolment_max_date = DateTime.now().plus({
        weeks: Number(_max_bookahead)
    }).setZone(_timezone);

    if (_max_bookahead_eow_push == 1) {
        enrolment_max_date = enrolment_max_date.endOf('week');
    }

    // Throw out of date range error if weekdate is greater than maximum enrolment date.
    let outofrange = (Number(DateTime.fromSQL(options.weekdate).toSeconds()) > Number(enrolment_max_date.toSeconds()));
    if (outofrange) {
        throw new RangeError('Date Range Error: Your chosen weekdate is further in the future than allowed. Please choose another date.');
    };

    /** Get calendar settings */
    let calendar_interval = Number(dbClientFlat(await db.raw("SELECT value FROM settings WHERE name = 'calendar_intervals'")).value);
    let calendar_starttime = Number(dbClientFlat(await db.raw("SELECT value FROM settings WHERE name = 'class_min_time'")).value);
    let calendar_endtime = Number(dbClientFlat(await db.raw("SELECT value FROM settings WHERE name = 'class_max_time'")).value);
    let calendar_timeslots = createCalendarTimeslots(calendar_starttime, calendar_endtime, calendar_interval);

    /** Setup Filters */
    let filtered_classes = false; // Boolean switch for filters.
    let filters = {
            "day_filter": this.parse(options.day_filter) == '' ? [] : options.day_filter.includes(',') ? this.parse(options.day_filter).split(',').map((i) => {
                return Number(i)
            }) : [Number(options.day_filter)],
            "time_filter": this.parse(options.time_filter) == '' ? [] : JSON.parse(`[${options.time_filter}]`),
            "instructor_filter": this.parse(options.instructor_filter) == '' ? [] : this.parse(options.instructor_filter).split(',').map((i) => {
                return `'` + i + `'`
            }),
            "level_filter": this.parse(options.level_filter) == '' ? [] : this.parse(options.level_filter).split(',').map((i) => {
                return `'` + i + `'`
            })
        },
        filters_applied = filters.day_filter.length > 0 || filters.instructor_filter.length > 0 || filters.level_filter.length > 0 || filters.time_filter.length > 0 ? true : false,
        filtered_availabilities = options.avail_type ? true : false;

    // Check if time_filter is used, create min time and max time to create a range.
    if (filters.time_filter.length > 0) {
        let final_time_array = [];
        let tf = filters.time_filter;
        for (let i = 0; i < tf.length; i++) {
            let decimals = tf[i].decimals;
            final_time_array.push(decimals.startdecimal);
            final_time_array.push(decimals.enddecimal);
        }
        filters.time_filter = final_time_array;
    }

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
    let classdump = await getclasses();

    // Start Class Details generation.
    let performance_array = [];
    for (let i = 0; i < classdump.length; i++) {
        let c = classdump[i];
        if (startofweek == 'sunday') {
            if (c.classday == 7) {
                c.weekday = DateTime.fromISO(startdate).plus({
                    hours: c.endTimeDecimal
                }).setZone(_timezone, {
                    keepLocalTime: true
                });
            } else {
                c.weekday = DateTime.fromISO(startdate).plus({
                    days: (c.classday),
                    hours: c.endTimeDecimal
                }).setZone(_timezone, {
                    keepLocalTime: true
                });
            }
        } else {
            c.weekday = DateTime.fromISO(startdate).plus({
                days: (c.classday - 1),
                hours: c.endTimeDecimal
            }).setZone(_timezone, {
                keepLocalTime: true
            });
        }

        // Set calculated class date.
        if (c.weekday < DateTime.fromISO(options.weekdate) || c.weekday < DateTime.now().setZone(_timezone)) {
            c.current_week_day = c.weekday;
            c.weekday = c.weekday.plus({
                weeks: 1
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
        c.details = await processClass(c.weekday, c.max, c);
        if (c.details.remove) {
            classdump.splice(i, 1);
            i -= 1;
        }
        let pend = performance.now();
        performance_array.push((pend - pstart) / 1000);
        c.waitlists = await processWaitlists(c);
        c.outofrange = c.weekday > enrolment_max_date;

        // for (let i = 0; i < c.details.enrolments.length; i++) {
        //     let e = c.details.enrolments[i];
        //     // let att = await attendance(e);
        //     // e.attendance = att || null;
        // }
    }

    // If classes are filtered, get ALL classes from SQL DB, then filter them with JS
    if (options.avail_type) {
        debugger;
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

    if (filtered_classes && !options.list_only) {
        page.total = Math.ceil((filtered_classes.length / limit));
    }
    let _weekdate_seconds = DateTime.fromISO(options.weekdate).toSeconds(),
        _maxdate_seconds = enrolment_max_date.toSeconds(),
        _classes = filtered_classes.length > 0 && !options.list_only ? filtered_classes.slice(offset, (offset + limit)) : options.class_uuid ? classdump[0] : classdump,
        _maxdate_iso = enrolment_max_date.toISODate(),
        _makeup_maxdate = makeup_max_date.toISODate(),
        _limit = limit || null,
        _offset = offset || null,
        _page = page || null,
        _last_offset = last_offset || null,
        _prev = prev || null,
        _next = next || null,
        _total = total || null;

    let finalobj = {
        'outofrange': {
            'outofrange': outofrange,
            'weekdate_seconds': _weekdate_seconds,
            'maxdate_seconds': _maxdate_seconds,
            'weekdate': options.weekdate
        },
        "filters": {
            "day": filters.day_filter,
            "time": filters.time_filter,
            "instructor": filters.instructor_filter,
            "level": filters.level_filter
        },
        // Paginate classes when they're filtered with slice();
        "classes": _classes,
        'max_date': _maxdate_iso,
        'makeup_max_date': _makeup_maxdate,
        'startofweek': startdate.toISODate(),
        'endofweek': enddate.toISODate(),
        'performance': performance_array,
        'peformance_total': performance_array.length > 0 ? performance_array.reduce((a, b) => {
            return a + b
        }) : [],
        'times_array': calendar_timeslots
    }

    if (_limit) finalobj.limit = _limit;
    if (_offset) finalobj.offset = _offset;
    if (_page) finalobj.page = _page;
    if (_last_offset) finalobj.last_offset = _last_offset;
    if (_prev) finalobj.prev = _prev;
    if (_next) finalobj.next = _next;
    if (_total) finalobj.total = _total;

    return finalobj;

    /** Functions */

    function createCalendarTimeslots(starttime, endtime, interval) {
        let timeslot_array = [];
        while (starttime < endtime) {
            timeslot_array.push(starttime);
            starttime += interval;
        }
        return timeslot_array
    }

    async function processClass(weekday, classmax, classinfo) {
        let enrolments,
            wea = [], // weekly enrolment array
            maa = [], // makeup availability array
            aa, // absence array
            mea = [], // makeup enrolments array
            tae = [], // total active enrols array
            naa, // next active available
            att = [], // attendance array
            nextavailable_permanent,
            weekday_arr = [],
            classprocess_startdate = startdate,
            classprocess_enddate = enddate,
            classprocess_weekday = weekday;

        // Get enrolment counts and availabilities.
        let idx = 0;
        while (classprocess_weekday <= enrolment_max_date.plus({
                weeks: 1
            })) {

            // Break loop if over 1000.
            if (idx > 1000) break;

            // Get enrolments and attendances.
            let enrolments_processed = await processEnrolments(classinfo, classprocess_weekday);

            // Set all enrolments on first pass. Otherwise, later weeks will overwrite the first loop, thus there will be missing enrolments if there are drop dates on any enrolments.
            if (idx === 0) enrolments = enrolments_processed.enrolments;

            // Set total number of enrolments, absences and makeup availabilities.
            wea.push(enrolments_processed.total);
            aa = enrolments_processed.absences;
            maa.push(classmax - (enrolments_processed.total - enrolments_processed.absences.length));

            // Push the weekday being calculated. This will be used for calculating dates for availabilities.
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

            // Increase index of the loop by 1.
            idx += 1;
        }

        let mu_array_indexes = [],
            mu_avail = [],
            mu_avail_max,
            mu_weekday_arr = [];

        // Find makeups.
        for (let i = 0; i < weekday_arr.length; i++) {
            const day = weekday_arr[i];
            if (day <= makeup_max_date) { // current day being calulated <= maximum makeup date
                if (maa[i] > 0) { // if makeup count is > 0  
                    mu_avail.push({
                        'date': day,
                        'availabilities': maa[i],
                        'total': maa[i]
                    });
                }
            } else {
                break;
            }
        }
        debugger;
        // Create makeup response.
        if (mu_avail.length > 0) { //check makeups available
            mu_unavail_response = {
                "code": 100,
                "response": "Availabilities found."
            };
        } else {
            if (options.list_only && options.avail_type === 'temporary') {
                return {
                    "remove": true
                };
            } else {
                mu_unavail_response = { // otherwise no availabilities
                    "code": 101,
                    "response": 'No availabilities.'
                }
            }
        }
        if (weekday > makeup_max_date) { // if current day > maximum makeup date.
            if (options.list_only && options.avail_type === 'temporary') {
                return {
                    "remove": true
                };
            } else {
                mu_unavail_response = {
                    "code": 102,
                    "response": `Too far into future.`
                }
            }
        }

        // Find overbookings.
        let overbooked = () => {
            let x = wea.find((a) => {
                return a > classmax;
            });
            if (x) return true;
            else return false;
        }

        let last_max = wea.lastIndexOf(classmax); // get last found max booking

        if (overbooked() || last_max == (wea.length - 1)) { // if overbooked === true OR last_max is the last week of calculations, class is full.
            if(options.list_only && options.avail_type === 'permanent' && !show_full_classes) {
                return {
                    "remove": true
                }
            } else {
                nextavailable_permanent = null; // null response
            }
        } else {
            if (last_max === -1) { // if no max booking found.
                nextavailable_permanent = weekday_arr[0]; // set next available date to first date.
            } else {
                nextavailable_permanent = weekday_arr[last_max + 1];
            }
        }

        // Is class currently running?
        classinfo.isrunning = false;
        if (DateTime.now().setZone(_timezone) >= weekday.minus({
                hours: (classinfo.endTimeDecimal - classinfo.startTimeDecimal)
            }) && DateTime.now().setZone(_timezone) <= weekday) {
            classinfo.isrunning = true;
        }

        return {
            'attendance': att,
            'absence_array': aa,
            'makeup_availabilities': mu_avail,
            'maa': maa,
            'makeup_avail_max': mu_avail_max || null,
            'makeup_response': mu_unavail_response,
            'makeup_avail_indexes': mu_array_indexes,
            'nextavailable_permanent': nextavailable_permanent ? nextavailable_permanent.toISODate() : false,
            'total': Math.max(...wea),
            'weekday': weekday.toISODate(),
            'weekday_arr': weekday_arr,
            'weekly_total_enrols': wea,
            'enrolments': enrolments,
            'outofrange': weekday > enrolment_max_date
        };
    }

    async function processEnrolments(classinfo, date) {

        let enrolobject = {
            'active_enrols': [],
            'trial_enrols': [],
            'makeup_enrols': [],
            'casual_enrols': []
        };
        let enrolmenttotal = options.trial_convert ? -1 : 0;

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
        let absences = dbClient(await db.raw(`
            SELECT 
                a.*, 
                s.firstName, 
                s.lastName
            FROM absences a 
                LEFT JOIN enrolments e 
                    on a.enrolment_uuid = e.uuid 
                LEFT JOIN students s 
                    on e.student_uuid = s.uuid
            WHERE 
                a.class_uuid = '${classinfo.uuid}' AND a.absence_date = ${Number(date.toSeconds())} AND a.status = 'active';
        `));

        // Loop and sort enrolments
        if (Array.isArray(enrolments)) {
            enrolmenttotal += enrolments.length;
            for (let i = 0; i < enrolments.length; i++) {
                const e = enrolments[i];

                // Minus enrolment total for future enrolments.
                if (DateTime.fromJSDate(e.startDate).setZone(_timezone, {
                        keepLocalTime: true
                    }) > date) enrolmenttotal -= 1;

                // Create enrolment types array
                switch (e.enrolmentType) {
                    case 1:
                        enrolobject.active_enrols.push(e)
                        break;
                    case 2:
                        enrolobject.makeup_enrols.push(e)
                        break;
                    case 3:
                        enrolobject.trial_enrols.push(e)
                        break;
                    case 5:
                        enrolobject.casual_enrols.push(e)
                        break;
                }

                // Mark absences in enrolments array.
                // Match enrolment with absences.
                e.absent = Boolean(absences.find(({
                    enrolment_uuid
                }) => enrolment_uuid = e.uuid));
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
            'absences': absences,
            'total': enrolmenttotal
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

    async function getclasses() {
        if (options.class_uuid) {
            return dbClient(await db.raw(`
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
                c.startdate,
                c.enddate,
                ct.shortName,
                ct.id,
                i.id,
                cl.id
            FROM classes c LEFT JOIN classTypes ct ON c.classtype_uuid = ct.uuid LEFT JOIN staff i ON c.instructor_uuid = i.uuid LEFT JOIN classLevels cl ON cl.uuid = c.classlevel_uuid
            WHERE c.uuid = '${options.class_uuid}'`));
        } else {
            return dbClient(await db.raw(`
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
                c.startdate,
                c.enddate,
                ct.shortName,
                ct.id,
                i.id,
                cl.id
        
            FROM classes c LEFT JOIN classTypes ct ON c.classtype_uuid = ct.uuid LEFT JOIN staff i ON c.instructor_uuid = i.uuid LEFT JOIN classLevels cl ON cl.uuid = c.classlevel_uuid
            WHERE c.startdate <= '${enddate.toISODate()}' AND (c.enddate >= '${startdate.toISODate()}' OR ISNULL(c.enddate)) ${filters_applied ? 'AND':''}
            ${filters.day_filter.length > 0 ? `c.day IN(${filters.day_filter})` : ``}
            ${filters.day_filter.length > 0 && (filters.level_filter.length > 0 || filters.instructor_filter.length > 0 || filters.time_filter.length > 0) ? `AND` : ``}
            ${filters.level_filter.length > 0 ? `c.classlevel_uuid IN(${filters.level_filter})` : ``}
            ${filters.level_filter.length > 0 && (filters.instructor_filter.length > 0 || filters.time_filter.length > 0) ? `AND` : ``}
            ${filters.instructor_filter.length > 0 ? `c.instructor_uuid IN(${filters.instructor_filter})`: ``}
            ${filters.instructor_filter.length > 0 && filters.time_filter.length > 0 ? `AND` : ``}
            ${filters.time_filter.length > 0 ? `c.startTimeDecimal BETWEEN ${Math.min(...filters.time_filter)} AND ${Math.max(...filters.time_filter)}`: ``}
            GROUP BY c.uuid, c.id, c.startTimeDecimal, c.endTimeDecimal, c.instructor_uuid, c.classlevel_uuid, c.day,
                        c.startTimeDisplay, c.endTimeDisplay, c.max, c.classtype_uuid
            ORDER BY
            (CASE (SELECT value FROM settings WHERE name = 'weekstart')
                WHEN 'Sunday' THEN
                    FIELD(day, 7, 1, 2, 3, 4, 5, 6)
                WHEN 'Monday' THEN
                    c.day
            END),c.startTimeDecimal,cl.id, i.id
            ${(filtered_availabilities && !options.list_only) || options.data_type === 'calendar' ? `` : options.list_only ? `LIMIT ` + limit :  `LIMIT `+ offset+`, `+limit}
            `));
        }
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