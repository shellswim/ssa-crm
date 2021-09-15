
exports.up = function(knex) {
  return knex.schema
    .table('enrolments', function (table) {
      table.integer('student').unsigned();
      table.foreign('student').references('id').inTable('students');
    })
};

exports.down = function(knex) {
  return knex.schema
    .table('enrolments', function (table) {
      table.dropForeign('student');
      table.dropColumn('student');
    })
};
