dmx.Formatter('object', 'jsonStringify', function (obj) {
    return JSON.stringify(obj);
});
dmx.Formatter('array', 'arrayStringify', function (arr) {
    return JSON.stringify(arr);
});
dmx.Formatter('array', 'objectFromArray', function (arr) {
    let a = arr;
    let b = {};
    for (let i = 0; i < a.length; i += 2) {
        if (a.length % 2 !== 0) {
            throw Error('Array not divisible by 2. Cannot create object of key value pairs.');
        }
        b[a[i]] = a[i + 1];
    }
    return b;
});