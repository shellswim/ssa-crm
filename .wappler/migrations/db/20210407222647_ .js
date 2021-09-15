
exports.up = function(knex) {
  return knex.schema
    .table('familyNotes', function (table) {
      table.dropColumn('family');
    })
};

exports.down = function(knex) {
  return knex.schema
    .table('familyNotes', function (table) {
      table.integer('family');
    })
};
