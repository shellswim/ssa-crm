const mathjs = require('mathjs');
const db = require('../../../lib/core/db');
const _ = require('underscore');
const moment = require('moment-timezone');

exports.absenceRequest = async function (options) {

    options = this.parse(options);
    let settings = {
        "timezone": dbClient(await db.raw(`
            SELECT value
            FROM settings
            WHERE name = 'timezone'
        `)).value
    }
    
    let current_time = moment.utc().tz(settings.timezone);

    //////////// Database Connection //////////
    const connection = this.parseRequired('db', 'string', 'connection is required.');
    // get the database connection
    const db = this.getDbConnection(connection);
    // throw error if connection not found
    if (!db) throw new Error(`Connection "${connection}" doesn't exist.`);
    //////////// End database connection //////////


    let abs_start = Number(moment.tz(options.absence_start, settings.timezone).format('X')),
        abs_end = Number(moment.tz(options.absence_end, settings.timezone).format('X')),
        mu_eligible = !!Number(options.makeup_eligible),
        absencearray = [],
        enrolments = classes(dbClientArray(db.raw(`
        SELECT e.uuid, e.student_uuid, e.class_uuid
        FROM enrolments e
        WHERE student_uuid = '${options.student_uuid}'
    `)));

    // Get classes and weekday of those classes.
    async function classes(e) {

        // e = enrolments
        for(let i=0;i<e.length;i++) {
            let e = e[i], estart = Number(moment(e.startDate).format('X')), eend = e.dropDate === null ? null : Number(moment(e.dropDate).format('X'));
            let start = moment(abs_start), end = moment(abs_end);
            while(start < end) {
                if(estart <= end && (eend >= start || eend === null)) {
                    let c = dbClient(db.raw(`
                        SELECT c.uuid, e.student_uuid, c.startTimeDecimal, c.endTimeDecimal, c.day AS dayint
                        FROM 
                            classes c 
                            JOIN enrolments e 
                                ON c.uuid = e.class_uuid
                        WHERE   
                            e.uuid = '${e.uuid}'
                    `));
                    let cweekdate = moment(start).add(c.dayint,'d');
                    if(cweekdate >= start && cweekdate <= end) {
                        absencearray.push({
                            "enrolment_uuid": e.uuid,
                            "class_uuid": c.uuid,
                            "absence_date": Number(cweekdate.format('X')),
                            "excused": mu_eligible,
                            "makeup_token_uuid": 'mut_' + self.crypto.randomUUID().replaceAll('-')
                        });
                    }
                }
                start.add(1, 'week');
            }
        }
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
    return {
        "absences": absencearray,
        "currenttime": current_time,
        "enrolments": enrolments
    }
}