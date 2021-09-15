
exports.up = function(knex) {
  return knex.schema
    .table('students', function (table) {
      table.string('age');
    })
};

exports.down = function(knex) {
  return knex.schema
    .table('students', function (table) {
      table.dropColumn('age');
    })
};
