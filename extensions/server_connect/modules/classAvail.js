const moment = require('moment');
const db = require('../../../lib/core/db');
const _ = require('underscore');
const {
    performance
} = require('perf_hooks');
const mathjs = require('mathjs');

exports.classAvail = async function (options) {
    options = this.parse(options);
    let max = options.maxweeks,
        mumax = moment().add(options.makeup_max_days, 'd'),
        mu_unavail_response,
        originalDates = {
            "startDate": moment(options.startdate),
            "endDate": moment(options.enddate),
            "weekday": moment(options.weekdate)
        },
        dates_arr = [],
        weekday_arr = [],
        filtered_classes,
        process_time_array = [],
        filters = {
            "day_filter": this.parse(options.day_filter) == ''  ? [] : this.parse(options.day_filter).map((i) => { return Number(i)}),
            "time_filter": this.parse(options.time_filter) == ''  ? [] : this.parse(options.time_filter).map((i) => { return Number(i)}),
            "instructor_filter": this.parse(options.instructor_filter) == ''  ? [] : this.parse(options.instructor_filter).map((i) => { return `'`+i+`'`}),
            "level_filter": this.parse(options.level_filter) == ''  ? [] : this.parse(options.level_filter).map((i) => { return `'`+i+`'`})
        }
        filters_applied = filters.day_filter.length > 0 || filters.instructor_filter.length > 0 || filters.level_filter.length > 0 || filters.time_filter.length > 0 ? true : false,
        filtered_availabilities = options.avail_type ? true : false;

    //////////// Database Connection //////////
    const connection = this.parseRequired('db', 'string', 'connection is required.');
    // get the database connection
    const db = this.getDbConnection(connection);
    // throw error if connection not found
    if (!db) throw new Error(`Connection "${connection}" doesn't exist.`);
    //////////// End database connection //////////

    //////////// Start List Type Calculations //////////
    if (options.data_type == 'list2') {

        // Set weekdate
        let wed = moment(options.weekdate);

        // Class Max Enrols
        let classmax = await db.raw('SELECT max FROM classes WHERE id = ?', [options.classid]);
        classmax = dbClient(classmax).max;

        let classresponse = await classProcess(wed, options.classid, classmax, options.classdump);

        return classresponse;
    }

    ////////// Start Calendar Type Calculations //////////
    else if (options.data_type == 'calendar' || options.data_type == 'list') {

        let tc = dbClient(await db.raw(`
            SELECT COUNT(*) as t
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

        // Create paging variables for Bootstrap Pagination
        let limit = this.parse(options.limit),
        total = tc,
        offset = this.parse(options.offset);
        last_offset = (total % limit) === 0 ? (total - limit) : (total - (total % limit)),
        page = {
                "total": Math.ceil((total / limit)),
                "current": ((offset + limit)/limit),
                "offset": {
                    "first": 0,
                    "last": (total % limit) === 0 ? (total - limit) : (total - (total % limit)),
                    "next": (offset + limit) > total ? last_offset : (offset + limit),
                    "prev": (offset - limit) <= 0 ? 0 : (offset - limit)
                }
            },
        next = (offset + limit) > total ? last_offset : (offset + limit),
        prev = (offset - limit) <= 0 ? 0 : (offset - limit);

        let jscd = dbClientArray(await db.raw(`
        SELECT c.uuid,
            c.id,
            c.startTimeDecimal,
            c.endTimeDecimal,
            c.instructor_uuid,
            c.classlevel_uuid,
            c.day,
            c.startTimeDisplay,
            c.endTimeDisplay,
            c.max,
            c.classtype_uuid,
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
        FROM classes c
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
        ORDER BY c.day, c.startTimeDecimal
        ${filtered_availabilities ? `` : `LIMIT `+ offset+`, `+limit}
        `));

        // let cd = options.classdump;
        let cd = jscd;
        // Set class times slots for calendar
        let mintime, maxtime, calint, stt, ts_arr = [];
        calint = Number(dbClient(await db.raw("SELECT value FROM settings WHERE name = 'calendar_intervals'")).value);
        mintime = Number(dbClient(await db.raw("SELECT value FROM settings WHERE name = 'class_min_time'")).value);
        maxtime = Number(dbClient(await db.raw("SELECT value FROM settings WHERE name = 'class_max_time'")).value);
        stt = mintime;
        // Create Timeslot Array
        while (stt < maxtime) {
            ts_arr.push(stt);
            stt += calint;
        }

        let pstart = performance.now();
        for (let i = 0; i < cd.length; i++) {
            let c = cd[i],
                wed = null;
            c.details = {};
            wed = moment(options.startdate).add((c.day - 1), 'days');
            c.optsd = options.startdate;
            c.wed = wed;

            c.details = await classProcess(wed, c.id, c.max, c);
            c.waitlists = await waitlists(c);

            for (let i = 0; i < c.details.enrolments.length; i++) {
                let e = c.details.enrolments[i];
                // let att = await attendance(e);
                // e.attendance = att || null;
            }
        }
        let pend = performance.now();


        let avail_array = [];
        if (options.avail_type) {
            if (options.avail_type == 'permanent') {
                filtered_classes = _.filter(cd, function (o) {
                    let fc = (Number(o.max) - Number(o.details.total)) >= options.avail_amount;
                    return fc;
                });
            } else if (options.avail_type == 'temporary') {
                filtered_classes = _.filter(cd, function (o) {
                    return Number(o.details.makeup_avail_max) >= Number(options.avail_amount);
                });
            }
        }

        if(filtered_classes) {
            page.total = Math.ceil((filtered_classes.length / limit));
        }

        let classresponse = {
            'process_times': process_time_array,
            "timesarray": ts_arr,
            "filters": {
                "day": filters.day_filter,
                "time": filters.time_filter,
                "instructor": filters.instructor_filter,
                "level": filters.level_filter
            },
            "availarray": avail_array,
            "classes": filtered_classes ? filtered_classes.slice(offset, (offset + limit)) : cd,
            "limit": limit,
            "offset": offset,
            "page": page,
            "last_offset": last_offset,
            "prev": prev,
            "next": next,
            "total": total,
            "perclassaverage_perf": ((pend - pstart) / 1000) / process_time_array.length
        }

        return classresponse;
    }

    async function classProcess(wed, classid, classmax, classinfo) {
        let pstartclass = performance.now();
        // wd = Weekday, wda = Weekday Array
        let ci = classinfo,
            e = JSON.parse(ci.enrolments),
            wd = moment(wed),
            wd_unix = moment(wd).unix(),
            enr_total = [],
            wda = [],
            eca = [],
            att = [],
            absence = [];

        delete ci.enrolments;

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
            Object.keys(e).forEach(key => {
                // et = enrolment type => loops through enrolment object from MySQL db.
                let et = e[key];
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

            wda.push(wd.format('YYYY-MM-DD'));
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
            if (moment(wda[mu_array_indexes[i]]).isSameOrBefore(mumax) && moment(wda[mu_array_indexes[i]]).isSameOrAfter(moment())) {
                mu_avail.push({
                    'date': wda[mu_array_indexes[i]],
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
        mu_unavail_response = moment(wda[0]).isAfter(mumax) ? mu_unavail_response = {
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
        let nextactive = wda[endmax + 1] ? moment(wda[endmax + 1]) : null;
        if (nextactive != 0 && nextactive != null) {
            if (nextactive.isBefore(moment())) {
                nextactive.add(7, 'd');
            }
        }
        let pendclass = performance.now();
        process_time_array.push(((pendclass - pstartclass) / 1000));
        return {
            'process_time': (pendclass - pstartclass) / 1000,
            'enrolcount': eca,
            'active': nextactive ? nextactive.format('YYYY-MM-DD') : null,
            'makeup': mu_avail,
            'makeup_avail_max': mu_avail_max || null,
            'makeup_response': mu_unavail_response,
            'total': Math.max(...enr_total),
            'weekday': wed,
            'enrolments': e
        };
    }

    async function waitlists(c) {
        let ci = c;
        // GET WAITLIST
        let waitlisted = dbClientArray(await db.raw(`
        SELECT w.*, s.firstName, s.lastName, s.dob, s.age, s.family, s.uuid 
        FROM waitlists w LEFT JOIN students s ON w.student_uuid = s.uuid  
        WHERE (w.endtimedec >= ${ci.endTimeDecimal} 
            AND w.starttimedec <= ${ci.startTimeDecimal} 
            AND w.dayint = '${ci.day}' 
            AND (w.instructor_uuid = '${ci.instructor_uuid}' 
                OR w.instructor_uuid IS NULL) 
            AND w.fulfil_date IS NULL 
            AND (w.classlevel_uuid = '${ci.classlevel_uuid}'
                OR w.classlevel_uuid IS NULL))
        ORDER BY w.request_date`));

        return waitlisted.length === 0 ? null : waitlisted;
    }

    async function attendance(e) {
        let att = dbClientArray(await db.raw(`
            SELECT *
            FROM attendance a 
            WHERE a.enrolment_uuid = '${e.uuid}'
            ORDER BY attendance_date DESC
            LIMIT 5
        `));
        return att;
    }

    async function absences(e, times) {
        let a = dbClient(await db.raw(`
        SELECT *
        FROM absences a 
        WHERE a.enrolment_uuid = '${e.uuid}'
    `));
    }

    function dbClient(v) {
        if (db.client.config.client == 'mysql' || db.client.config.client == 'mysql2') {
            return v[0][0];
        } else if (db.client.config.client == 'postgres' || db.client.config.client == 'redshift') {
            return v = v.rows;
        }
    }

    function dbClientArray(v) {
        if (db.client.config.client == 'mysql' || db.client.config.client == 'mysql2') {
            return v[0];
        } else if (db.client.config.client == 'postgres' || db.client.config.client == 'redshift') {
            return v = v.rows;
        }
    }
}