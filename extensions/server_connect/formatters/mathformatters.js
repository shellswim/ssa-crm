const { evaluate, sum, chain: mathchain, round } = require('mathjs');

module.exports = {
    round_sum: function(val) {
         return round(val,2);
    },
    sum: function(val) {
        return (sum(val));
    }
}
