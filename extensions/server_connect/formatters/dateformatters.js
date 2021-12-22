const moment = require('moment-timezone');
// const db = require('../../../lib/core/db');
// let connection, db;

// (async function() {
//     //////////// Database Connection //////////
//     connection = this.parseRequired('db', 'string', 'connection is required.');
//     // get the database connection
//     db = this.getDbConnection(connection);
//     // throw error if connection not found
//     if (!db) throw new Error(`Connection "${connection}" doesn't exist.`);
//     //////////// End database connection //////////
// })();

module.exports = {
    startMonth: function(val) {
        return moment(val).startOf('month');
    },
    startWeek: function(val) {
        return moment(val).startOf('week');
    },
    endMonth: function(val) {
        return moment(val).endOf('month');
    },
    endWeek: function(val) {
        return moment(val).endOf('week');
    },
    localtime: function(val) {
        const tz = db.raw(`SELECT value FROM settings WHERE name = 'timezone'`)[0][0];
        return moment(val).tz(tz.timezone);
    }
}