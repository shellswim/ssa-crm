
exports.up = function(knex) {
  return knex.schema
    .table('families', function (table) {
      table.string('street1');
      table.string('street2');
      table.string('suburb');
      table.string('state');
    })
};

exports.down = function(knex) {
  return knex.schema
    .table('families', function (table) {
      table.dropColumn('street1');
      table.dropColumn('street2');
      table.dropColumn('suburb');
      table.dropColumn('state');
    })
};
