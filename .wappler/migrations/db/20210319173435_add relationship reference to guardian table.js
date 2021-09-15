
exports.up = function(knex) {
  return knex.schema
    .table('guardians', function (table) {
      table.integer('relationship').unsigned();
      table.foreign('relationship').references('id').inTable('relationships');
    })
};

exports.down = function(knex) {
  return knex.schema
    .table('guardians', function (table) {
      table.dropForeign('relationship');
      table.dropColumn('relationship');
    })
};
