const moment = require('moment-timezone');
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
    }
}