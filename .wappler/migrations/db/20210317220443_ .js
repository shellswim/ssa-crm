exports.down = function (knex) {
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
