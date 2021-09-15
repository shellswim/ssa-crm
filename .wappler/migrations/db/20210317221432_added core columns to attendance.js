
exports.up = function(knex) {
  return knex.schema
    .table('attendance', function (table) {
      table.integer('enrolment').unsigned();
      table.foreign('enrolment').references('id').inTable('enrolments');
      table.timestamp('updated');
    })
};

exports.down = function(knex) {
  return knex.schema
    .table('attendance', function (table) {
      table.dropForeign('enrolment');
      table.dropColumn('enrolment');
      table.dropColumn('updated');
    })
};
