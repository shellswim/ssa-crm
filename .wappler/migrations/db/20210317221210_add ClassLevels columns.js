
exports.up = function(knex) {
  return knex.schema
    .table('classLevels', function (table) {
      table.string('name');
      table.boolean('isValid');
    })
};

exports.down = function(knex) {
  return knex.schema
    .table('classLevels', function (table) {
      table.dropColumn('name');
      table.dropColumn('isValid');
    })
};
