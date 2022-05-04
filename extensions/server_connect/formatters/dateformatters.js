const {DateTime} = require('luxon');


module.exports = {
    startMonth: function(val,reformat,reformat_type,custom_format) {
        let date = DateTime.fromSQL(val).startOf('month');
        if(reformat === true) {
            switch (reformat_type.toLowerCase()) {
                case 'ISO':
                    date = date.toISODate()
                    break;
                case 'seconds':
                    date = date.toSeconds()
                    break;
                case 'sql': 
                    date = date.toSQLDate()
                    break;
                case 'custom': 
                    date = date.toFormat(custom_format)
                    break;
            }
        }
        return date;
    },
    startWeek: function(val,reformat,reformat_type,custom_format) {
        let date = DateTime.fromSQL(val).startOf('week');
        if(reformat === true) {
            switch (reformat_type.toLowerCase()) {
                case 'ISO':
                    date = date.toISODate()
                    break;
                case 'seconds':
                    date = date.toSeconds()
                    break;
                case 'sql': 
                    date = date.toSQLDate()
                    break;
                case 'custom': 
                    date = date.toFormat(custom_format)
                    break;
            }
        }
        return date;
    },
    endMonth: function(val,reformat,reformat_type,custom_format) {
        let date = DateTime.fromSQL(val).endOf('month');
        if(reformat === true) {
            switch (reformat_type.toLowerCase()) {
                case 'ISO':
                    date = date.toISODate()
                    break;
                case 'seconds':
                    date = date.toSeconds()
                    break;
                case 'sql': 
                    date = date.toSQLDate()
                    break;
                case 'custom': 
                    date = date.toFormat(custom_format)
                    break;
            }
        }
        return date;
    },
    endWeek: function(val,reformat,reformat_type,custom_format) {
        let date = DateTime.fromSQL(val).endOf('week');
        if(reformat === true) {
            switch (reformat_type.toLowerCase()) {
                case 'ISO':
                    date = date.toISODate()
                    break;
                case 'seconds':
                    date = date.toSeconds()
                    break;
                case 'sql': 
                    date = date.toSQLDate()
                    break;
                case 'custom': 
                    date = date.toFormat(custom_format)
                    break;
            }
        }
        return date;
    },
    localtime: function(val,tz) {
        return DateTime.fromISO(val).setZone(tz).toFormat('yyyy-MM-dd HH:MM:ss');
    },
    lux_toformat: function(val,format) {
        return DateTime.fromISO(val).toFormat(format);
    }
}