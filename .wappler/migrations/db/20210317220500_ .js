
exports.up = function(knex) {
  return knex.schema
    .table('families', function (table) {
      table.integer('students').unsigned();
      table.foreign('students').references('id').inTable('students');
    })
    .table('guardians', function (table) {
      table.integer('family').unsigned();
      table.foreign('family').references('id').inTable('families');
    })
    .table('students', function (table) {
      table.integer('family').unsigned();
      table.foreign('family').references('id').inTable('families');
    })
};

exports.down = function(knex) {
  return knex.schema
    .table('families', function (table) {
      table.dropForeign('students');
      table.dropColumn('students');
    })
    .table('guardians', function (table) {
      table.dropForeign('family');
      table.dropColumn('family');
    })
    .table('students', function (table) {
      table.dropForeign('family');
      table.dropColumn('family');
    })
};
