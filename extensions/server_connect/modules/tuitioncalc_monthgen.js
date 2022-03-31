const moment = require('moment-timezone');
const { DateTime } = require('luxon');
const db = require('../../../lib/core/db');
const _ = require('underscore');

exports.tuitioncalc_monthgen = async function(options) {

    //////////// Database Connection //////////
    const connection = this.parseRequired('db', 'string', 'connection is required.');
    // get the database connection
    const db = this.getDbConnection(connection);
    // throw error if connection not found
    if (!db) throw new Error(`Connection "${connection}" doesn't exist.`);
    //////////// End database connection //////////

    options = this.parse(options);

    let chargearray = [];

    let startdate = DateTime.fromISO(options.startdate, {zone: 'utc'}),
        startofmonth = startdate.startOf('month'),
        chargeahead = !!dbClientFlat(await db.raw(`
            SELECT value
            FROM settings
            WHERE name = 'billing_charge_ahead'
        `)).value;

    let charges = await get_charges(startofmonth);
    // return await get_charges(startofmonth);

    if(Array.isArray(charges) && charges.length > 0) {
        chargearray = create_monthsarray(charges);
    } else {
        let months = [startofmonth.toISODate()];
        if(chargeahead) {
            months.push(startofmonth.plus({months: 1}).toISODate());
        }
        chargearray = months;
    }

    async function get_charges(date) {
        return dbClient(await db.raw(`
            SELECT cf.chargeFor_monthly AS monthlycharge
            FROM charges_family cf
            WHERE cf.family_uuid = '${options.family_uuid}' AND cf.chargeFor_monthly >= DATE('${date}')
            ORDER BY cf.chargeFor_monthly
        `));
    }
    
    function create_monthsarray(c) {
        let montharray = [];
        for(let i=0;i<c.length;i++) {
            let date = c[i].monthlycharge;
            // return DateTime.fromJSDate(date, {zone: 'utc'}).toFormat('yyyy-MM-dd');
            // return date;
            let charge = DateTime.fromJSDate(date, {zone: 'utc'}).toFormat('yyyy-MM-dd');
            montharray.push(charge);
        }
        return montharray;
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