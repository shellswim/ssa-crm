
exports.up = function(knex) {
  return knex.schema
    .renameTable('notes', 'familyNotes')
    .table('notes', function (table) {
      table.integer('family').unsigned();
      table.foreign('family').references('id').inTable('families');
    })
};

exports.down = function(knex) {
  return knex.schema
    .table('notes', function (table) {
      table.dropForeign('family');
      table.dropColumn('family');
    })
    .renameTable('familyNotes', 'notes')
};
