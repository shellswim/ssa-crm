
exports.up = function(knex) {
  return knex.schema
    .table('familyNotes', function (table) {
      table.string('subject');
    })
    .table('studentNotes', function (table) {
      table.string('subject');
    })
};

exports.down = function(knex) {
  return knex.schema
    .table('familyNotes', function (table) {
      table.dropColumn('subject');
    })
    .table('studentNotes', function (table) {
      table.dropColumn('subject');
    })
};
