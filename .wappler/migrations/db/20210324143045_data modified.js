
exports.up = function(knex) {
  return knex('guardians').where('id', 49).update({"family":"36"})
};

exports.down = function(knex) {
};
