
exports.up = function(knex) {
  return knex.schema
    .table('classes', function (table) {
      table.integer('classType').unsigned();
      table.foreign('classType').references('id').inTable('classTypes');
    })
};

exports.down = function(knex) {
  return knex.schema
    .table('classes', function (table) {
      table.dropForeign('classType');
      table.dropColumn('classType');
    })
};
