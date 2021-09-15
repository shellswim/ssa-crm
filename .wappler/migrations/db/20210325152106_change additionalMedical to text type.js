
exports.up = function(knex) {
  return knex.schema
    .table('students', function (table) {
      table.text('additionalMedical').alter();
    })
};

exports.down = function(knex) {
  return knex.schema
    .table('students', function (table) {
      table.string('additionalMedical', 255).alter();
    })
};
