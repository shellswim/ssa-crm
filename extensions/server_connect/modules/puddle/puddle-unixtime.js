
module.exports = {
    timeadd: function(x,period) {
        let dayseconds = 86400;
        switch(period) {
            case 'days':
            case 'day':
            case 'd': {
                return x * dayseconds;
            }
            case 'weeks':
            case 'week':
            case 'w': {
                return x * dayseconds * 7;
            }
        }
    }
}