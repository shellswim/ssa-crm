const {DateTime} = require('luxon');

exports.datepickerSingleDay = async function (options) {
    debugger;
    options = this.parse(options);

    // Get options.
    let nofuture = options.nofuture;
    let weeksahead = Number(options.weeksahead) || null;
    let weeksprevious = Number(options.weeksprevious) || 0;
    let maxdate = options.maxdate ? DateTime.fromISO(options.maxdate) : null;
    let totalweeks = weeksahead + weeksprevious;
    let dayofweek = Number(options.dayofweek);
    let startdate = DateTime.fromISO(options.startdate).startOf('week').minus({weeks: weeksprevious}).plus({days: (dayofweek - 1)}) || DateTime.now().startOf('week').minus({weeks: weeksprevious}).plus({days: (dayofweek - 1)});

    // Return array.
    let dates_array;

    if (!weeksahead && !!maxdate) {
        // Dates from start to maxdate - no max weeks limit.
        dates_array = datestomaxdate();
    } else if (!!weeksahead && !!nofuture) {
        // Dates from start with max weeks ahead - but no future dates.
        dates_array = datestoweeks_nofuture();
    } else if (!!weeksahead && !nofuture) {
        // Dates from start to future date by max weeks.
        dates_array = datestoweeks_future();
    } else {
        dates_array = datestotoday();
    }

    function datestomaxdate() {
        let d = [];
        while(startdate <= maxdate) {
            if(startdate < DateTime.fromISO(options.startdate)) {
                startdate = startdate.plus({weeks: 1});
                continue;
            }
            d.push(startdate);
            startdate = startdate.plus({weeks: 1});
        }
        return d;
    }
    
    function datestoweeks_nofuture() {
        let d = [];
        let max = datefromstart();
        while(startdate < max) {
            if(startdate < DateTime.fromISO(options.startdate)) {
                startdate = startdate.plus({weeks: 1});
                continue;
            }
            d.push(startdate);
            startdate = startdate.plus({weeks: 1});
        }
        return d;
    }
    function datestoweeks_future() {
        let d = [];
        let max = DateTime.now().plus({weeks: weeksahead});
        while(startdate < max) {
            if(startdate < DateTime.fromISO(options.startdate)) {
                startdate = startdate.plus({weeks: 1});
                continue;
            }
            d.push(startdate);
            startdate = startdate.plus({weeks: 1});
        }
        return d;
    }

    function datestotoday() {
        let d = [];
        while(startdate <= DateTime.now().startOf('day')) {
            if(startdate < DateTime.fromISO(options.startdate)) {
                startdate = startdate.plus({weeks: 1});
                continue;
            }
            d.push(startdate);
            startdate = startdate.plus({weeks: 1});
        }
        return d;
    }

    function datefromstart() {
        return startdate.plus({weeks: weeksahead});
    }

    if(dates_array.length === 0) {
        dates_array.push('No dates found.');
    }

    return dates_array;
}