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
debugger;
data = _.groupBy(data, 'startTimeDecimal');
let inf, lf, tf;
if(filters.instructor_filter.length > 0) inf = filters.instructor_filter.filter(Boolean).length;
if(filters.level_filter.length > 0) lf = filters.level_filter.filter(Boolean).length;
if(filters.time_filter.length > 0) tf = Boolean(filters.time_filter.filter(Boolean).length);


if(!inf && !lf && !tf) {
  for(i=0;i<times.length;i++) {
    if(!data.hasOwnProperty(times[i])) {
      data[times[i]] = {};
    }
  }
}
let performance_array = [];
let pstart = performance.now();
for(std in data) {
  data[std]= _.groupBy(data[std], 'classday');
  if(Array.isArray(data[std]) && data[std].length > 0) data[std].sort((a,b) => a.instructor_uuid - b.instructor_uuid);
  if(filters.day_filter.length == 0) {
    transdata.days = [];
    for(i=1;i<=7;i++) {
      if(!data[std].hasOwnProperty(i)){
        data[std][i] = [];
      }
      transdata.days.push(i);
    }
  } else {
    let df = filters.day_filter;
    transdata.days = df;
    for(i=0;i<df.length;i++) {
      if(!data[std].hasOwnProperty(df[i])){
        data[std][df[i]] = [];
      }
    }
  }
}
let pend = performance.now();
performance_array.push((pend - pstart) / 1000);

let sortedKeys = Object.keys(data).sort(function(a,b) {return a-b});

transdata.orderedtimes = sortedKeys;
transdata.classes = data;
transdata.filters = filters;
transdata.perf_array = performance_array;
transdata.perf_total = performance_array.length > 0 ? performance_array.reduce((a,b) => {return a + b}) : [];

return transdata;

}