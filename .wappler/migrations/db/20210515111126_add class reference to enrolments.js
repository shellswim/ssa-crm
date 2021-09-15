
exports.up = function(knex) {
  return knex.schema
    .table('enrolments', function (table) {
      table.integer('classId').alter().unsigned();
    })
};

exports.down = function(knex) {
  return knex.schema
    .table('enrolments', function (table) {
      table.integer('classId').alter();
    })
};
