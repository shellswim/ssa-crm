const {DateTime} = require('luxon');


module.exports = {
    startMonth: function(val,reformat,reformat_type,custom_format) {
        debugger;
        let date = DateTime.fromSQL(val).startOf('month');
        return date.toISODate();
    },
    startWeek: function(val,reformat,reformat_type,custom_format) {
        let date = DateTime.fromSQL(val).startOf('week');
        return date.toISODate();
    },
    endMonth: function(val,reformat,reformat_type,custom_format) {
        let date = DateTime.fromSQL(val).endOf('month');
        return date.toISODate();
    },
    endWeek: function(val,reformat,reformat_type,custom_format) {
        let date = DateTime.fromSQL(val).endOf('week');
        return date.toISODate();
    },
    fromMilliseconds: function(val) {
        return DateTime.fromMillis(val).toFormat('yyyy-MM-dd HH:MM:ss');
    },
    localtime: function(val,tz) {
        return DateTime.fromISO(val).setZone(tz).toFormat('yyyy-MM-dd HH:MM:ss');
    },
    lux_toformat: function(val,format) {
        return DateTime.fromISO(val).toFormat(format);
    },
    timestamp_milliseconds: function() {
        return DateTime.now().toMillis();
    }
}