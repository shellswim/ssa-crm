const { filter } = require("underscore");

module.exports = {
    lastIndex: function(val) {
        return arr.lastIndexOf(val);
    },
    push: function(val, push) {
        return moment(val).startOf('week');
    },
    toNumbers: function(val) {
        let arr;
        if(typeof val === 'string') {
            arr = val.split(',');
            for(let i=0;i<arr.length;i++) {
                arr[i] = Number(arr[i]);
            }
        }
    },
    unstringify: function(val) {
        return JSON.parse(val);
    },
    stringify: function(val) {
        return JSON.stringify(val);
    },
    removeEmptyObjects: function(val) {
        return val.filter(a => {
            return Object.keys(a).length > 0;
        });
    }
}
