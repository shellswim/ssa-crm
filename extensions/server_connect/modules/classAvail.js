const moment = require('moment');
const db = require('../../../lib/core/db');

exports.classAvail = async function (options) {

    options = this.parse(options);

    // Database Connection
    const connection = this.parseRequired('db', 'string', 'connection is required.');
    // get the database connection
    const db = this.getDbConnection(connection);
    // throw error if connection not found
    if (!db) throw new Error(`Connection "${connection}" doesn't exist.`);
    // Class Max Enrols
    let classmax = await db.raw('SELECT max FROM classes WHERE id = ?', [options.classid]);
    classmax = dbClient(classmax).max;
    let max = options.maxweeks,
        mumax = moment().add(options.makeup_max_days, 'd'),
        mu_unavail_response,
        std = moment(options.startdate),
        end = moment(options.enddate),
        wed = moment(options.weekdate),
        originalDates = {"startDate": moment(options.startdate), "endDate": moment(options.enddate), "weekday": moment(options.weekdate)},
        dates_arr = [],
        weekday_arr = [],
        enr_total = [];

    for (let i = 0; i < max; i++) {
        // DB Query
        let q = await db.raw('SELECT COUNT(id) AS total FROM enrolments WHERE classId = ? AND (dropDate >= ? OR dropDate IS NULL) AND isValid = true AND startDate <= ?', [options.classid, std.format('YYYY-MM-DD'), end.format('YYYY-MM-DD')]);
        q = dbClient(q);
        // Add total to array
        enr_total.push(q.total);
        // dates_arr[i] = {'startdate': std.format('YYYY-MM-DD'), 'enddate': end.format('YYYY-MM-DD'), 'weekdate': wed.format('YYYY-MM-DD')};
        weekday_arr.push(wed.format('YYYY-MM-DD'));
        std = std.add(7, 'days');
        end = end.add(7, 'days');
        wed = wed.add(7, 'days');
    }
    let mu_array_indexes = [],
        mu_avail = [];

    // Add makeup availability array
    for (let i = 0; i < enr_total.length; i++) {
        if (enr_total[i] < classmax) {
            mu_array_indexes.push(i);
        }
    }
    for (let i = 0; i < mu_array_indexes.length; i++) {
        if (moment(weekday_arr[mu_array_indexes[i]]).isSameOrBefore(mumax) && moment(weekday_arr[mu_array_indexes[i]]).isSameOrAfter(moment())) {
            mu_avail.push({'date': weekday_arr[mu_array_indexes[i]], 'availabilities': classmax - enr_total[mu_array_indexes[i]]});
        }
    }
    // Set makeup response if no makeups available.
    mu_unavail_response = moment(weekday_arr[0]).isAfter(mumax) ? mu_unavail_response = {"code": 102, "response": 'Too far into future.'} : mu_avail.length == 0 && originalDates.startDate < mumax ? {"code": 101, "response": 'No availabilities'} : {"code": 100, "response": "Availabilities found."};

    function dbClient(v) {
        if (db.client.config.client == 'mysql' || db.client.config.client == 'mysql2') {
            return v = v[0][0];
        } else if (db.client.config.client == 'postgres' || db.client.config.client == 'redshift') {
            return v = v.rows;
        }
    }

    let endmax = enr_total.lastIndexOf(classmax);
    let nextactive = moment(weekday_arr[endmax + 1]) || 0;
    if(nextactive.isBefore(moment()) && nextactive != 0) {
        nextactive.add(7,'d');
    }
    let nextavail = {
        'active': nextactive.format('YYYY-MM-DD') || 0,
        'makeup': mu_avail,
        'makeup_response': mu_unavail_response,
        'total': Math.max(...enr_total),
        'weekday': weekday_arr[0],
        'arrays' : {
            'ernolTotal': enr_total,
            'mu_array_indexes': mu_array_indexes,
            'makeupmax': mumax
        }
    };
    return nextavail;
}