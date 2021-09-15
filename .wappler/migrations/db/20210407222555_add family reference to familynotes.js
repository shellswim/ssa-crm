
exports.up = function(knex) {
  return knex.schema
    .table('familyNotes', function (table) {
      table.integer('family').unsigned();
      table.foreign('family').references('undefined').inTable('undefined');
    })
};

exports.down = function(knex) {
  return knex.schema
    .table('familyNotes', function (table) {
      table.dropForeign('family');
      table.dropColumn('family');
    })
};
