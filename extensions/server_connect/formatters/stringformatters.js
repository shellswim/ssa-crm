module.exports = {
    pdl_truncate: function(val,length,ellipses,default_return) {
        let string = val;
        if(!string) return default_return || '';
        if(string.length > length) {
            string = string.substring(0,length) + ellipses;
        }
        return string;
    },

    pdl_decimal_to_time: function(val, period, shortened) {
        return decimalToTime(val, period, shortened);
    }
}

function decimalToTime(number, period = false, shortened = false) {
    // Check sign of given number
    var sign = (number >= 0) ? 1 : -1;
    var ampm = number < 12 ? "AM" : "PM";
    // Set positive value of number of sign negative
    number = number * sign;
    // Separate the int from the decimal part
    var hour = Math.floor(number);
    var decpart = number - hour;
    hour = Math.floor(number) > 12 ? Math.floor(number) - 12 : hour == 0 ? hour = 12 : hour;
    var min = 1 / 60;
    // Round to nearest minute
    decpart = min * Math.round(decpart / min);
    var minute = Math.floor(decpart * 60) + '';
    // Add padding if need
    if (minute.length < 2) {
        minute = '0' + minute;
    }
    // Add Sign in final result
    sign = sign == 1 ? '' : '-';
    // Concate hours and minutes
    if (shortened) {
        time = hour;
    } else {
        time = `${sign + hour + ':' + minute}${period ? ' ' + ampm : ''}`;
    }
    return time;
}