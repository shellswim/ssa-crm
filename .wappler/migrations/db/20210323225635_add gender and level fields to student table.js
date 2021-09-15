
exports.up = function(knex) {
  return knex.schema
    .table('students', function (table) {
      table.string('gender');
      table.integer('level').unsigned();
      table.foreign('level').references('id').inTable('classLevels');
    })
};

exports.down = function(knex) {
  return knex.schema
    .table('students', function (table) {
      table.dropColumn('gender');
      table.dropForeign('level');
      table.dropColumn('level');
    })
};
