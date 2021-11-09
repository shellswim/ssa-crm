const _ = require('underscore');

exports.classCalendarJSON = function(options) {

let data = this.parse(options.data);
let transdata = {};
let times = this.parse(options.classtimes);
let filters = {
  "day_filter": this.parse(options.day_filter),
  "time_filter": this.parse(options.time_filter),
  "instructor_filter": this.parse(options.instructor_filter),
  "level_filter": this.parse(options.level_filter)
}

data = _.groupBy(data, 'startTimeDecimal');
let inf = filters.instructor_filter.split(',').filter(Boolean).length, lf = filters.level_filter.split(',').filter(Boolean).length, tf = Boolean(filters.time_filter.split(',').filter(Boolean).length);
if(!inf && !lf && !tf) {
  for(i=0;i<times.length;i++) {
    if(!data.hasOwnProperty(times[i])) {
      data[times[i]] = {};
    }
  }
}

for(std in data) {
  data[std]= _.groupBy(data[std], 'day_int');
  if(!filters.day_filter) {
    transdata.days = [];
    for(i=1;i<=7;i++) {
      if(!data[std].hasOwnProperty(i)){
        data[std][i] = [];
      }
      transdata.days.push(i);
    }
  } else {
    let df = filters.day_filter.split(',');
    transdata.days = df;
    for(i=0;i<df.length;i++) {
      if(!data[std].hasOwnProperty(df[i])){
        data[std][df[i]] = [];
      }
    }
  }
}

let sortedKeys = Object.keys(data).sort(function(a,b) {return a-b});

transdata.orderedtimes = sortedKeys;
transdata.classes = data;
transdata.filters = filters;

return transdata;

}