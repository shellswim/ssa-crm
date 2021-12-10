const moment = require('moment-timezone');
const db = require('../../../lib/core/db');
const _ = require('underscore');

exports.tuitiondates = async function(options) {

    //////////// Database Connection //////////
    const connection = this.parseRequired('db', 'string', 'connection is required.');
    // get the database connection
    const db = this.getDbConnection(connection);
    // throw error if connection not found
    if (!db) throw new Error(`Connection "${connection}" doesn't exist.`);
    //////////// End database connection //////////

    options = this.parse(options);
    let fid = options.familyid;
    let datesarray = [];

    // Get Timezone
    let tz = dbClientFlat(await db.raw(`SELECT value FROM settings WHERE name = 'timezone'`));
    // Get current time
    let currenttime = moment.utc().tz(tz.timezone);

    let chargeahead = dbClientFlat(await db.raw(`SELECT value FROM settings WHERE name = 'billing_cycle_charge_ahead'`)).value;
    let maxcharge = dbClientFlat(await db.raw(`SELECT MAX(chargeFor_monthly) AS value FROM charges_family WHERE family = ${fid}`)).value;
    // Start Date Manipulation
    const startdate = moment(options.startdate).startOf('month').format('YYYY-MM-DD');
    // return moment(maxcharge).isAfter(moment(startdate));
    // If max charge has value and greater than current month.
    if(maxcharge && (moment(maxcharge).isAfter(moment(startdate)))) {
        let dp = moment(startdate).clone();
        while(moment(dp).isSameOrBefore(moment(maxcharge))) {
            datesarray.push(moment(dp).format('YYYY-MM-DD'));
            moment(dp).add(1, 'month');
        }
    } 
    // Else if start date is next month
    else if(moment(startdate).month() > moment(currenttime).month()) {  
        if(chargeahead == 1) {
            datesarray.push(startdate);
        }
    } 
    // Otherwise push current month.
    else {
        datesarray.push(moment(currenttime).clone().startOf('month').format('YYYY-MM-DD'));
        if(chargeahead == 1) {
            datesarray.push(moment(startdate).clone().add(1, 'month').format('YYYY-MM-DD'));
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

    return datesarray;
}