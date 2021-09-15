
exports.up = function(knex) {
  return knex.schema
    .createTable('enrolments', function (table) {
      table.increments('id');
      table.integer('student').unsigned();
      table.foreign('student').references('id').inTable('students');
      table.date('startDate');
      table.date('dropDate');
      table.boolean('isValid');
    })
};

exports.down = function(knex) {
  return knex.schema
    .dropTable('enrolments')
};
