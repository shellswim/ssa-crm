const _ = require("underscore");

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
    },
    filterArrayObjects: function(val,path,operator,arg) {
        return val.filter(a => {
            switch (operator) {
                case "==":
                    return _.get(a,path) == arg;
                case ">=":
                    return _.get(a,path) >= arg;
                case "<=":
                    return _.get(a,path) <= arg;
                case ">":
                    return _.get(a,path) > arg;
                case "<":
                    return _.get(a,path) < arg;
                case "length":
                    return _.get(a,path).length == arg;
                case "length_greater":
                    return _.get(a,path).length > arg;
                case "length_less":
                    return _.get(a,path).length < arg;
            }
        })
    },
    reduceArrayObjects: function(val,group) {
        let newobj = [];
        for(let i = 0;i<val.length;i++) {
            let o = val[i];
            newobj.push(o[group]);
        }
        return newobj;
    }
}
