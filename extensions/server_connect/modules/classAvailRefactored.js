const {
    DateTime
} = require('luxon');
const db = require('../../../lib/core/db');
const _ = require('underscore');
const {
    performance
} = require('perf_hooks');
const mathjs = require('mathjs');

exports.classAvailabilities = async function (options) {

    options = this.parse(options);

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
    let makeup_max = DateTime.now().plus({
        days: _makeup_max_days
    }).setZone(_timezone);

    /** Get calendar settings */
    let calendar_interval = Number(dbClient(await db.raw("SELECT value FROM settings WHERE name = 'calendar_intervals'")).value);
    let calendar_starttime = Number(dbClient(await db.raw("SELECT value FROM settings WHERE name = 'class_min_time'")).value);
    let calendar_endtime = Number(dbClient(await db.raw("SELECT value FROM settings WHERE name = 'class_max_time'")).value);
    let calendar_timeslots = createCalendarTimeslots(calendar_starttime, calendar_endtime,calendar_interval);

    /** Setup Filters */
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
    let classcount = dbClient(await db.raw(`
        SELECT COUNT(uuid) as t
        FROM classes c
        WHERE isactive = true ${filters_applied ? `AND` : ``}
        ${filters.day_filter.length > 0 ? `c.day IN(${filters.day_filter})` : ``}
        ${filters.day_filter.length > 0 && (filters.level_filter.length > 0 || filters.instructor_filter.length > 0 || filters.time_filter.length > 0) ? `AND` : ``}
        ${filters.level_filter.length > 0 ? `c.classlevel_uuid IN(${filters.level_filter})` : ``}
        ${filters.level_filter.length > 0 && (filters.instructor_filter.length > 0 || filters.time_filter.length > 0) ? `AND` : ``}
        ${filters.instructor_filter.length > 0 ? `c.instructor_uuid IN(${filters.instructor_filter})`: ``}
        ${filters.instructor_filter.length > 0 && filters.time_filter.length > 0 ? `AND` : ``}
        ${filters.time_filter.length > 0 ? `c.startTimeDecimal IN(${filters.time_filter})`: ``}
    `)).t;

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
        let classdump = dbClientArray(await db.raw(`
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
            ct.baseRate,
            ct.shortName,

            JSON_OBJECT(
                    'active_enrols',
                    (
                        SELECT JSON_ARRAYAGG(
                                        JSON_OBJECT(
                                                'age', s.age,
                                                'class_uuid', e.class_uuid,
                                                'dob', s.dob,
                                                'dropDate', e.dropDate,
                                                'enrolmentType', e.enrolmentType,
                                                'family', s.family,
                                                'firstName', s.firstName,
                                                'isTransferIn', e.isTransferIn,
                                                'isTransferOut', e.isTransferOut,
                                                'lastName', s.lastName,
                                                'startDate', e.startDate,
                                                'student_uuid', s.uuid,
                                                'transferToStart', e.transferToStart,
                                                'uuid', e.uuid
                                            )
                                    )
                        FROM enrolments e
                                    LEFT JOIN students s ON e.student_uuid = s.uuid
                        WHERE e.enrolmentType = 1
                            AND e.isValid = 1
                            AND (e.dropDate >= '${originalDates.startDate.format('YYYY-MM-DD')}' OR e.dropDate IS NULL)
                            AND e.class_uuid = c.uuid
                    ),
                    'makeup_enrols',
                    (
                        SELECT JSON_ARRAYAGG(
                                        JSON_OBJECT(
                                                'age', s.age,
                                                'class_uuid', e.class_uuid,
                                                'dob', s.dob,
                                                'dropDate', e.dropDate,
                                                'enrolmentType', e.enrolmentType,
                                                'family', s.family,
                                                'firstName', s.firstName,
                                                'isTransferIn', e.isTransferIn,
                                                'isTransferOut', e.isTransferOut,
                                                'lastName', s.lastName,
                                                'startDate', e.startDate,
                                                'student_uuid', s.uuid,
                                                'transferToStart', e.transferToStart,
                                                'uuid', e.uuid
                                            )
                                    )
                        FROM enrolments e
                                    LEFT JOIN students s ON e.student_uuid = s.uuid
                        WHERE e.enrolmentType = 3
                            AND e.isValid = 1
                            AND (e.dropDate >= '${originalDates.startDate.format('YYYY-MM-DD')}' OR e.dropDate IS NULL)
                            AND e.class_uuid = c.uuid
                    ),
                    'trial_enrols',
                    (
                        SELECT JSON_ARRAYAGG(
                                        JSON_OBJECT(
                                                'age', s.age,
                                                'class_uuid', e.class_uuid,
                                                'dob', s.dob,
                                                'dropDate', e.dropDate,
                                                'enrolmentType', e.enrolmentType,
                                                'family', s.family,
                                                'firstName', s.firstName,
                                                'isTransferIn', e.isTransferIn,
                                                'isTransferOut', e.isTransferOut,
                                                'lastName', s.lastName,
                                                'startDate', e.startDate,
                                                'student_uuid', s.uuid,
                                                'transferToStart', e.transferToStart,
                                                'uuid', e.uuid
                                            )
                                    )
                        FROM enrolments e
                                    LEFT JOIN students s ON e.student_uuid = s.uuid
                        WHERE e.enrolmentType = 3
                            AND e.isValid = 1
                            AND (e.dropDate >= '${originalDates.startDate.format('YYYY-MM-DD')}' OR e.dropDate IS NULL)
                            AND e.class_uuid = c.uuid
                    ),
                    'casual_enrols',
                    (
                        SELECT JSON_ARRAYAGG(
                                        JSON_OBJECT(
                                                'age', s.age,
                                                'class_uuid', e.class_uuid,
                                                'dob', s.dob,
                                                'dropDate', e.dropDate,
                                                'enrolmentType', e.enrolmentType,
                                                'family', s.family,
                                                'firstName', s.firstName,
                                                'isTransferIn', e.isTransferIn,
                                                'isTransferOut', e.isTransferOut,
                                                'lastName', s.lastName,
                                                'startDate', e.startDate,
                                                'student_uuid', s.uuid,
                                                'transferToStart', e.transferToStart,
                                                'uuid', e.uuid
                                            )
                                    )
                        FROM enrolments e
                                    LEFT JOIN students s ON e.student_uuid = s.uuid
                        WHERE e.enrolmentType = 5
                            AND e.isValid = 1
                            AND (e.dropDate >= '${originalDates.startDate.format('YYYY-MM-DD')}' OR e.dropDate IS NULL)
                            AND e.class_uuid = c.uuid
                    )
                ) AS enrolments
        FROM classes c LEFT JOIN classTypes ct ON c.classtype_uuid = ct.uuid
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
        END),c.startTimeDecimal
        ${filtered_availabilities ? `` : `LIMIT `+ offset+`, `+limit}
        `));
        
        // Start Class Details generation.
        for (let i = 0; i < classdump.length; i++) {
            let c = classdump[i];
            c.weekday = DateTime.fromISO(options.startdate).plus({days: (c.classday - 1)});
            c.details = {};

            // c.details = await processClass(weekday, c.uuid, c.max, c);
            // c.waitlists = await waitlists(c);

            // for (let i = 0; i < c.details.enrolments.length; i++) {
            //     let e = c.details.enrolments[i];
            //     // let att = await attendance(e);
            //     // e.attendance = att || null;
            // }
        }

        return classdump;






    /** Functions */
    
    function createCalendarTimeslots(starttime, endtime, interval) {
        let timeslot_array = [];
        while(starttime < endtime) {
            timeslot_array.push(starttime);
            starttime += interval;
        }
        return timeslot_array
    }

    async function processClass(weekday, class_uuid, classmax, classinfo) {
        // wd = Weekday, wda = Weekday Array
        let classinfo = classinfo,
            enrolments = JSON.parse(classinfo.enrolments),
            enr_total = [],
            weekday_arr = [],
            enrolment_count = [],
            att = [],
            absence = [];

        delete classinfo.enrolments;

        let startd = moment(options.startdate),
            endd = moment(options.enddate);

        ///// Availabilities
        for (let i = 0; i < max; i++) {
            let enrolcount = {
                "active_enrols": 0,
                "makeup_enrols": 0,
                "trial_enrols": 0,
                "casual_enrols": 0,
            };
            enrolments.map(en => {
                
            })
            Object.keys(enrolments).forEach(key => {
                // et = enrolment type => loops through enrolment object from MySQL db.
                let et = enrolments[key];
                if (et !== null) {
                    // Loop through enrolments in enrolment object.
                    for (let j = 0; j < et.length; j++) {
                        // **** en = current enrolment in loop.
                        let en = et[j];
                        let estart = moment(en.startDate),
                            edrop = moment(en.dropDate);
                        if (estart.isSameOrBefore(endd) && (!en.dropDate || edrop.isSameOrAfter(startd))) {
                            enrolcount[key] += 1;

                            // // WHILE IN AVAILABILITIES, GET ATTENDANCE RECORDS AND GET ABSENCES FOR CURRENT WEEK.
                            // (async () => {
                            //     let att = await attendance(en);
                            //     en.attendance = att || null;
                            // })();
                        }
                    }
                } else {
                    enrolcount[key] = 0;
                }
            });
            let val = 0;
            Object.keys(enrolcount).forEach(key => {
                val += enrolcount[key] || 0;
            });
            enr_total.push(val);

            weekday_arr.push(wd.format('YYYY-MM-DD'));
            startd = startd.clone().add(7, 'days');
            endd = endd.clone().add(7, 'days');
            wd = wd.add(7, 'days');
        }

        let mu_array_indexes = [],
            mu_avail = [],
            mu_avail_max;

        // Add makeup availability array
        for (let i = 0; i < enr_total.length; i++) {
            if (enr_total[i] < Number(classmax)) {
                mu_array_indexes.push(i);
            }
        }
        for (let i = 0; i < mu_array_indexes.length; i++) {
            if (moment(weekday_arr[mu_array_indexes[i]]).isSameOrBefore(mumax) && moment(weekday_arr[mu_array_indexes[i]]).isSameOrAfter(moment())) {
                mu_avail.push({
                    'date': weekday_arr[mu_array_indexes[i]],
                    'availabilities': classmax - enr_total[mu_array_indexes[i]]
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
        mu_unavail_response = moment(weekday_arr[0]).isAfter(mumax) ? mu_unavail_response = {
            "code": 102,
            "response": 'Too far into future.',
            "total": 0
        } : mu_avail.length == 0 && originalDates.startDate < mumax ? {
            "code": 101,
            "response": 'No availabilities.',
            "total": 0
        } : {
            "code": 100,
            "response": "Availabilities found.",
            "total": mu_avail_max
        };

        let endmax = enr_total.lastIndexOf(classmax);
        let nextactive = weekday_arr[endmax + 1] ? moment(weekday_arr[endmax + 1]) : null;
        if (nextactive != 0 && nextactive != null) {
            if (nextactive.isBefore(moment())) {
                nextactive.add(7, 'd');
            }
        }
        process_time_array.push(((pendclass - pstartclass) / 1000));
        return {
            'enrolcount': enrolment_count,
            'active': nextactive ? nextactive.format('YYYY-MM-DD') : null,
            'makeup': mu_avail,
            'makeup_avail_max': mu_avail_max || null,
            'makeup_response': mu_unavail_response,
            'total': Math.max(...enr_total),
            'weekday': weekday,
            'enrolments': enrolments
        };
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