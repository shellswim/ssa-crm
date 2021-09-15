
exports.up = function(knex) {
  return knex.schema
    .table('enrolments', function (table) {
      table.dropColumn('student');
    })
};

exports.down = function(knex) {
  return knex.schema
    .table('enrolments', function (table) {
      table.integer('student');
    })
};
