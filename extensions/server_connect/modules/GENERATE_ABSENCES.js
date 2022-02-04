const mathjs = require('mathjs');
const db = require('../../../lib/core/db');
const _ = require('underscore');
const moment = require('moment-timezone');
const crypto = require('crypto');
const pud = require('./puddle/puddle-unixtime');

exports.absenceRequest = async function (options) {

    //////////// Database Connection //////////
    const connection = this.parseRequired('db', 'string', 'connection is required.');
    // get the database connection
    const db = this.getDbConnection(connection);
    // throw error if connection not found
    if (!db) throw new Error(`Connection "${connection}" doesn't exist.`);
    //////////// End database connection //////////

    options = this.parse(options);

    let settings = {
        "timezone": dbClient(await db.raw(`
            SELECT value
            FROM settings
            WHERE name = 'timezone'
        `)).value
    }

    let current_time = Number(moment.utc().tz(settings.timezone).format('X'));


    // abs_start IS absolute absence start time
    // abs_end IS absolute absence end time

    let abs_start = Number(moment(options.absence_start).format('X')),
        abs_end = !options.absence_end ? abs_start : Number(moment(options.absence_end).format('X')),
        mu_eligible = !!Number(options.makeup_eligible),
        enrolments = dbClientArray(await db.raw(`
        SELECT e.uuid, e.student_uuid, e.class_uuid, e.startDate, e.dropDate
        FROM enrolments e
        WHERE student_uuid = '${options.student_uuid}' AND e.isValid = 1
        `));

    async function generate_absences(e) {
        // check e (enrolments) is not undefined.
        if (e === undefined) {
            throw 'Error: No enrolment array found.'
        };

        // Get times in static unix format.
        // abs_start copy, abs_end copy
        let enrol_array = [];
        // Loop through enrolments
        for(let i=0;i<e.length;i++) {
            let en = e[i];
            let absence_array = [];
            let absence_date_array = [],
                enrol_start = Number(moment(en.startDate).format('X')),
                enrol_drop = en.dropDate === null ? null : Number(moment(en.dropDate).format('X'));

            // Check for date adjustment requirements (start date after absence start, drop date not null and before absence end)
            let start = enrol_start > abs_start ? enrol_start : abs_start;
            let end = !enrol_drop ? abs_end : enrol_drop < abs_end ? enrol_drop : abs_end;

            // Generate absence date array
            while (start <= end) {
                absence_date_array.push(start);
                start += pud.timeadd(1, 'd');
            }

            // Get class attached to enrolment
            let c = await classfromenrolment(en);

            // Filter date array for dates class falls on by day integer.
            absence_date_array = _.filter(absence_date_array, function (arr) {
                return moment.unix(arr).day() === c.dayint;
            });

            // Generate array of absences.
            for(let j=0;j<absence_date_array.length; j++) {
                let ab = absence_date_array[j];
                absence_array.push({
                    'absence_date_unix': ab,
                    'absence_date': moment.unix(ab).format('YYYY-MM-DD'),
                    'student': en.student_uuid,
                    'makeup_eligible': mu_eligible,
                    'enrolment': en.uuid,
                    'mutoken_uuid': 'mut_' + (crypto.randomUUID()).replaceAll('-','')
                });
            }
            if(absence_array.length > 0) {
                enrol_array.push({
                    "absences": absence_array,
                    'class_details': {
                        'uuid': c.uuid,
                        'classlevel_uuid': c.classlevel_uuid,
                        'day': c.dayint + 1,
                        'instructor': c.instructor_uuid,
                        'starttime': c.startTimeDisplay,
                        'starttime_decimal': c.startTimeDecimal
                    },
                    "enroluuid": en.uuid
                });
            }
        }
        let final_enrol_array = _(enrol_array).chain().sortBy(function(enrol) {
                                    return enrol.class_details.starttime_decimal
                                }).sortBy(function(enrol) {
                                    return enrol.class_details.dayint
                                }).value();
       return final_enrol_array;
    }

    async function classfromenrolment(e) {

        return dbClient(await db.raw(`
            SELECT c.uuid, e.student_uuid, c.startTimeDecimal, c.endTimeDecimal, (c.day - 1) AS dayint, c.instructor_uuid, c.startTimeDisplay, c.classlevel_uuid
            FROM
                classes c
                JOIN enrolments e
                    ON c.uuid = e.class_uuid
            WHERE
                e.uuid = '${e.uuid}' AND isValid = 1;
        `));

    }

    // PROCESS MYSQL QUERIES
    // --- dbClient returns flat, single result query.
    // --- dbClientArray returns all rows from query as array.

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


    // *****************************************************************************
    // RETURN OBJECT *************************************************************//
    let returnobj = {
        "currenttime": current_time || null,
        "enrolments": enrolments,
        "absence_enrolments": await generate_absences(enrolments),
        "student_uuid": options.student_uuid
    };
    return returnobj;
}