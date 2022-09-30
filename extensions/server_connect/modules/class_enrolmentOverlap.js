exports.class_enrolmentOverlap = async function (options) {
    debugger;
    options = this.parse(options);

    const   a = { "start": Number(options.originalclass_start), "end": Number(options.originalclass_end), "day": Number(options.originalclass_day), "uuid": options.originalclass_uuid },
            b = { "start": Number(options.newclass_start), "end": Number(options.newclass_end), "day": Number(options.newclass_day), "uuid": options.newclass_uuid };
    let duplicates = [];

    if(a.day === b.day && a.uuid !== b.uuid) {
        let a_range = minuteIncrements(a.start, a.end), b_range = minuteIncrements(b.start, b.end);
        duplicates = a_range.filter(function (a) {
            return b_range.indexOf(a) != -1;
        });
    }
    
    let returnobj = {
        "overlap_exists": duplicates.length > 0 ? true : false,
        get overlap_between() {
            if(this.overlap_exists) {
                return {
                    "start": decimalToTime(duplicates[0], true),
                    "end": decimalToTime(duplicates[duplicates.length - 1], true)
                }
            }
        },
        "doublebook": a.uuid === b.uuid
    }

    return returnobj;

    function minuteIncrements(start, end) {
        let a_arr = [];
        let count = 0;

        while (count < end) {
            if (count === 0) {
                count = start;
            }
            count += (100 / 60) / 100;
            a_arr.push(count);
        }

        return a_arr.map((i) => {
            return i.toFixed(4);
        });
    }

        //**  Convert decimal to display time. ****
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
}