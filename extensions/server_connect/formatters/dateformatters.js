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
    },
    localtime: function(val,tz) {
        return DateTime.fromISO(val).setZone(tz).toFormat('yyyy-MM-dd HH:MM:ss');
    },
    lux_toformat: function(val,format) {
        return DateTime.fromISO(val).toFormat(format);
    }
}