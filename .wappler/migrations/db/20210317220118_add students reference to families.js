
exports.up = function(knex) {
  return knex.schema
    .table('families', function (table) {
      table.integer('students').unsigned();
      table.foreign('students').references('id').inTable('students');
    })
};

exports.down = function(knex) {
  return knex.schema
    .table('families', function (table) {
      table.dropForeign('students');
      table.dropColumn('students');
    })
};
