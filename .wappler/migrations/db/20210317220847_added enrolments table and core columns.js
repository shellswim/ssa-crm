
exports.up = function(knex) {
  return knex.schema
    .createTable('enrolments', function (table) {
      table.increments('id');
      table.integer('student').unsigned();
      table.foreign('student').references('undefined').inTable('undefined');
      table.date('startDate');
      table.date('dropDate');
      table.boolean('isValid');
    })
};

exports.down = function(knex) {
  return knex.schema
    .dropTable('enrolments')
};
