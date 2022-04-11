const {DateTime} = require('luxon');


module.exports = {
    startMonth: function(val) {
        return DateTime.fromISO(val).startOf('month');
    },
    startWeek: function(val) {
        return DateTime.fromISO(val).startOf('week');
    },
    endMonth: function(val) {
        return DateTime.fromISO(val).endOf('month');
    },
    endWeek: function(val) {
        return DateTime.fromISO(val).endOf('week');
    }
}