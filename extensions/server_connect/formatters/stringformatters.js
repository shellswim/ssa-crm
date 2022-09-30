module.exports = {
    pdl_truncate: function(val,length,ellipses) {
        let string = val;
        if(string.length > length) {
            string = string.substring(0,length) + ellipses;
        }
        return string;
    }
}