
exports.up = function(knex) {
  return knex.schema
    .table('families', function (table) {
      table.integer('students').unsigned();
      table.foreign('students').references('id').inTable('students');
      table.integer('guardians').unsigned();
      table.foreign('guardians').references('id').inTable('guardians');
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
};
