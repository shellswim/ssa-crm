function nextStartDate(now, classinfo) {
    debugger;
    let cd = classinfo.day_int - 1;
    let n = moment(now);
    let dow = n.day();
    let sow = n.startOf('week');

    if(cd < dow) {
        sow.add((cd + 7), 'd');
        return sow.format('YYYY-MM-DD');
    } else if (cd >= dow) {
        return sow.add(cd, 'd').format('YYYY-MM-DD');
    }
}