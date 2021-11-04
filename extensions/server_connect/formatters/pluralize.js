const pluralize = require('pluralize');

module.exports.pluralize = function(str, count, inc) {
    return pluralize(str, count, inc);
}