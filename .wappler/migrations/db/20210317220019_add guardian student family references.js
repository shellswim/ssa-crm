
exports.up = function(knex) {
  return knex.schema
    .table('families', function (table) {
      table.integer('students').unsigned();
      table.foreign('students').references('undefined').inTable('undefined');
      table.integer('guardians').unsigned();
      table.foreign('guardians').references('undefined').inTable('undefined');
    })
    .table('guardians', function (table) {
      table.integer('family').unsigned();
      table.foreign('family').references('undefined').inTable('undefined');
    })
    .table('students', function (table) {
      table.integer('family').unsigned();
      table.foreign('family').references('undefined').inTable('undefined');
    })
};

exports.down = function(knex) {
  return knex.schema
    .table('families', function (table) {
      table.dropForeign('students');
      table.dropColumn('students');
      table.dropForeign('guardians');
      table.dropColumn('guardians');
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
