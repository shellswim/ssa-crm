
exports.up = function(knex) {
  return knex.schema
    .table('enrolments', function (table) {
      table.integer('student').alter().unsigned();
      table.boolean('isValid').alter();
    })
};

exports.down = function(knex) {
  return knex.schema
    .table('enrolments', function (table) {
      table.integer('student').alter();
      table.integer('isValid').alter();
    })
};
