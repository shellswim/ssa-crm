
exports.up = function(knex) {
  return knex.schema
    .table('phoneNumbers', function (table) {
      table.dropColumn('guardian');
      table.integer('guardianId').unsigned();
      table.foreign('guardianId').references('id').inTable('guardians');
    })
};

exports.down = function(knex) {
  return knex.schema
    .table('phoneNumbers', function (table) {
      table.integer('guardian');
      table.dropForeign('guardianId');
      table.dropColumn('guardianId');
    })
};
