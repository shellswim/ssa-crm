const _ = require('underscore');

exports.classCalendarJSON = function(options) {

let data = this.parse(options.data);
let times = this.parse(options.classtimes);
let filters = {
  "day_filter": this.parse(options.day_filter),
  "time_filter": this.parse(options.time_filter),
  "instructor_filter": this.parse(options.instrutor_filter),
  "level_filter": this.parse(options.level_filter)
}

data = _.groupBy(data, 'startTimeDecimal');

for(i=0;i<times.length;i++) {
  if(!data.hasOwnProperty(times[i])) {
    data[times[i]] = {};
  }
}

for(std in data) {
  data[std]= _.groupBy(data[std], 'day_int');
  if(!filters.day_filter) {
    for(i=1;i<=7;i++) {
      if(!data[std].hasOwnProperty(i)){
        data[std][i] = [];
      }
    }
  } else {
    let df = filters.day_filter.split(',');
    for(i=0;i<df.length;i++) {
      if(!data[std].hasOwnProperty(df[i])){
        data[std][df[i]] = [];
      }
    }
  }
}

function decimalToTime(number) {
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
  if (minute.length < 2) { minute = '0' + minute; }
  // Add Sign in final result
  sign = sign == 1 ? '' : '-';
  // Concate hours and minutes
  time = sign + hour + ':' + minute + " " + ampm;
  return time;
}

// data = Object.entries(data).sort(function(a,b) {return a[0]-b[0]});

data.filters = filters;

return data;

}