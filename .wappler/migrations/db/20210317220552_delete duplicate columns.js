
exports.up = function(knex) {
  return knex.schema
    .table('families', function (table) {
      table.dropColumn('students');
      table.dropColumn('guardians');
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
      table.integer('students');
      table.integer('guardians');
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
