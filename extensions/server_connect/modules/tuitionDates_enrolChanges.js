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
        let c = 0;
        while(moment(dp).isSameOrBefore(moment(maxcharge))) {
            let sd = moment(dp).format('YYYY-MM-DD');
            let dd_raw = dbClientFlat(await db.raw(`SELECT dueDate FROM charges_family WHERE family = ${fid} AND chargeFor_monthly = '${sd}'`));
            let dd = dd_raw ? moment(dd_raw.dueDate).format('YYYY-MM-DD') : null;
            datesarray.push({"date": sd, "due": dd });
            dp = moment(dp).add(1, 'month');
            ++c;
            if(c > 50) break;
        }
    }
    // Else if start date is next month
    else if(moment(startdate).month() > moment(currenttime).month()) {  
        if(chargeahead == 1) {
            datesarray.push({"date": startdate, "due": null });
        }
    } 
    // Otherwise push current month.
    else {
        datesarray.push({"date": moment(currenttime).clone().startOf('month').format('YYYY-MM-DD'), "due": null });
        if(chargeahead == 1) {
            datesarray.push({"date" : moment(startdate).clone().add(1, 'month').format('YYYY-MM-DD'), "due": null });
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