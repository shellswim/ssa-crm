const moment = require('moment-timezone');
const {
    DateTime
} = require('luxon');
const db = require('../../../lib/core/db');
const _ = require('underscore');

exports.tuitioncalc_monthgen = async function (options) {
    //////////// Database Connection //////////
    const connection = this.parseRequired('db', 'string', 'connection is required.');
    // get the database connection
    const db = this.getDbConnection(connection);
    // throw error if connection not found
    if (!db) throw new Error(`Connection "${connection}" doesn't exist.`);
    //////////// End database connection //////////

    options = this.parse(options);

    let chargearray = [];
    debugger;
    let startdate = DateTime.fromSQL(options.startdate),
        startofmonth = startdate.startOf('month'),
        chargeahead = !!dbClientFlat(await db.raw(`
            SELECT value
            FROM settings
            WHERE name = 'billing_charge_ahead'
        `)).value;

    let charges = await get_charges(startofmonth);

    debugger;
    if (Array.isArray(charges) && charges.length > 0) {
        chargearray = charges;

        // Push current start of month if not in array.
        if (!charges.includes(startofmonth.toISODate())) {
            charges.push(startofmonth.toISODate());
        }

        // Add missing months && add next month if chargeahead is enabled.
        let monthgoal = DateTime.now().startOf('month').toISODate();
        if (chargeahead && !chargearray.includes(DateTime.fromISO(monthgoal).plus({months: 1}).toISODate())) {
            monthgoal = DateTime.fromISO(monthgoal).plus({months: 1}).toISODate();
            chargearray.push(monthgoal);
        }

        // Sort Dates in ascending order.
        chargearray.sort((a, b) => DateTime.fromISO(a).toSeconds() - DateTime.fromISO(b).toSeconds());

        let cursor = DateTime.fromISO(startofmonth),
            x = 0;

        while (cursor < DateTime.fromISO(monthgoal)) {
            let c = cursor.toISODate();
            if (chargearray.indexOf(c) === -1) {
                chargearray.splice(findnearestdate(cursor, chargearray), 0, c);
            }
            cursor = cursor.plus({
                months: 1
            });
            x += 1;
            if (x > 1000) {
                break;
            }
        }
    } else {
        let months = [startofmonth.toISODate()];
        if (chargeahead && startofmonth.month <= DateTime.now().plus({
                months: 1
            }).month) {
            months.push(startofmonth.plus({
                months: 1
            }).toISODate());
        }
        chargearray = months;
    }

    async function get_charges(date) {
        let charges = dbClient(await db.raw(`
            SELECT cf.chargeFor_monthly AS monthlycharge
            FROM charges_family cf
            WHERE cf.family_uuid = '${options.family_uuid}' AND cf.chargeFor_monthly >= DATE('${date}')
            ORDER BY cf.chargeFor_monthly
        `));

        // Flatten objects from query.
        if (charges.length > 0) {
            charges = charges.map(a => {
                return DateTime.fromJSDate(a.monthlycharge).toISODate();
            });
        }

        return charges;
    }

    function findnearestdate(date, arr) {
        date = date.toSeconds()
        arr = arr.map(a => {
            return DateTime.fromISO(a).toSeconds();
        });
        let finder = arr.reduce((p, c) => {
            return Math.abs(c - date) < Math.abs(p - date) ?
                c : p;
        });
        if (finder > date) {
            return arr.indexOf(finder);
        } else {
            return arr.indexOf(finder) + 1;
        }
    }

    ///// DB Query Processor
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


    // RETURN DATA
    return chargearray;


}