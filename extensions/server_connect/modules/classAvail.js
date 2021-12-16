const moment = require('moment');
const db = require('../../../lib/core/db');
const _ = require('underscore');
const {
    performance
} = require('perf_hooks');

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
        weekday_arr = [], filtered_classes;

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

        let classresponse = await classProcess(wed, options.classid, classmax);

        return classresponse;
    }

    ////////// Start Calendar Type Calculations //////////
    else if (options.data_type == 'calendar' || options.data_type == 'list') {

        let pstart = performance.now();

        let cd = options.classdump;
        // Set class times slots for calendar
        let mintime, maxtime, calint, stt, ts_arr = [];
        calint = Number(dbClient(await db.raw("SELECT value FROM settings WHERE name = 'calendar_intervals'")).value);
        mintime = Number(dbClient(await db.raw("SELECT value FROM settings WHERE name = 'class_min_time'")).value);
        maxtime = Number(dbClient(await db.raw("SELECT value FROM settings WHERE name = 'class_max_time'")).value);
        stt = mintime;

        while (stt < maxtime) {
            ts_arr.push(stt);
            stt += calint;
        }

        for (let i = 0; i < cd.length; i++) {
            let c = cd[i], wed = null;
            c.details = {};
            wed = moment(options.startdate).add((c.day_int - 1), 'days');
            c.optsd = options.startdate;
            c.wed = wed;
            c.details = await classProcess(wed, c.id, c.max, c);
        }

        let pend = performance.now();
        let avail_array = [];
        if(options.avail_type) {
            if(options.avail_type == 'permanent') {
                filtered_classes = _.filter(cd, function(o) {
                    return (Number(o.max) - Number(o.details.total)) >= options.avail_amount;
                });
            } else if(options.avail_type == 'temporary') {
                filtered_classes = _.filter(cd, function(o) {
                    return Number(o.details.makeup_avail_max) >= Number(options.avail_amount);
                });
            }
        }
        let classresponse = {
            "timesarray": ts_arr,
            "availarray": avail_array,
            "classes": filtered_classes || cd,
            "perclassaverage_perf": ((pend - pstart) / 1000) / cd.length
        }

        return classresponse;
    }

    async function classProcess(wed, classid, classmax, classinfo) {
        let ci = classinfo;
        let enr_total = [];
        let wd = wed.clone();
        let wda = [];
        // let enr_all = [];
        let startd = moment(options.startdate),
            endd = moment(options.enddate);

        let active_enrols, makeup_enrols, trial_enrols, casual_enrols, waitlisted;

        ////// Get enrolments by type

            // Active
            active_enrols = dbClientEnrols(await db.raw('SELECT e.*, s.firstName, s.lastName, s.dob, s.age, s.family FROM enrolments e INNER JOIN students s ON e.student = s.id WHERE classId = ? AND enrolmentType = 1 AND (dropDate >= ? OR dropDate IS NULL) AND isValid = true', [classid, startd.format('YYYY-MM-DD')]));

            // Makeup
            makeup_enrols = dbClientEnrols(await db.raw('SELECT e.*, s.firstName, s.lastName, s.dob, s.age, s.family FROM enrolments e INNER JOIN students s ON e.student = s.id WHERE classId = ? AND enrolmentType = 2 AND (dropDate >= ? OR dropDate IS NULL) AND isValid = true', [classid, startd.format('YYYY-MM-DD')]));
            
            // Trial
            trial_enrols = dbClientEnrols(await db.raw('SELECT e.*, s.firstName, s.lastName, s.dob, s.age, s.family FROM enrolments e INNER JOIN students s ON e.student = s.id WHERE classId = ? AND enrolmentType = 3 AND (dropDate >= ? OR dropDate IS NULL) AND isValid = true', [classid, startd.format('YYYY-MM-DD')]));
            
            // Casual
            casual_enrols = dbClientEnrols(await db.raw('SELECT e.*, s.firstName, s.lastName, s.dob, s.age, s.family FROM enrolments e INNER JOIN students s ON e.student = s.id WHERE classId = ? AND enrolmentType = 5 AND (dropDate >= ? OR dropDate IS NULL) AND isValid = true', [classid, startd.format('YYYY-MM-DD')]));
            
            // Waitlist
            waitlisted = dbClientEnrols(await db.raw('SELECT w.*, s.firstName, s.lastName, s.dob, s.age, s.family FROM waitlists w INNER JOIN students s ON w.studentid = s.id  WHERE (w.endtimedec >= ? AND w.starttimedec <= ? AND w.dayint = ? AND (w.instructor = ? OR w.instructor IS NULL) AND w.fulfil_date IS NULL AND (w.classlevel = ? OR w.classlevel IS NULL))', [ci.endTimeDecimal, ci.startTimeDecimal, ci.day_int, ci.instructorid, ci.classLevel]));

        ///// Availabilities
        for (let i = 0; i < max; i++) {
            // DB Query
            let q = dbClient(await db.raw('SELECT COUNT(id) AS total FROM enrolments WHERE classId = ? AND (dropDate >= ? OR dropDate IS NULL) AND isValid = true AND startDate <= ?', [classid, startd.format('YYYY-MM-DD'), endd.format('YYYY-MM-DD')])).total;

            // Add total to array
            enr_total.push(q);

            // To test enrolments output.
            // let r = dbClient(await db.raw('SELECT * FROM enrolments WHERE classId = ? AND (dropDate >= ? OR dropDate IS NULL) AND isValid = true AND startDate <= ?', [classid, startd.format('YYYY-MM-DD'), endd.format('YYYY-MM-DD')]));
            // enr_all.push(r);

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

        if(mu_avail.length > 0) {
            let x = [];
            for(let i=0;i<mu_avail.length;i++) {
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
        let nextactive = moment(wda[endmax + 1]) || 0;
        if (nextactive.isBefore(moment()) && nextactive != 0) {
            nextactive.add(7, 'd');
        }
        return {
            'active': nextactive.format('YYYY-MM-DD') || 0,
            'makeup': mu_avail,
            'makeup_avail_max': mu_avail_max || null,
            'makeup_response': mu_unavail_response,
            'total': Math.max(...enr_total),
            'weekday': wd,
            'enrolments': {
                'active_enrols': active_enrols,
                'makeup_enrols': makeup_enrols,
                'trial_enrols': trial_enrols,
                'casual_enrols': casual_enrols,
                'waitlist': waitlisted
            }
        };
    }

    function dbClient(v) {
        if (db.client.config.client == 'mysql' || db.client.config.client == 'mysql2') {
            return v[0][0];
        } else if (db.client.config.client == 'postgres' || db.client.config.client == 'redshift') {
            return v = v.rows;
        }
    }
    function dbClientEnrols(v) {
        if (db.client.config.client == 'mysql' || db.client.config.client == 'mysql2') {
            return v[0];
        } else if (db.client.config.client == 'postgres' || db.client.config.client == 'redshift') {
            return v = v.rows;
        }
    }
}