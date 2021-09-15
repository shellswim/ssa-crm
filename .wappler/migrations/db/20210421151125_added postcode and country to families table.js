
exports.up = function(knex) {
  return knex.schema
    .table('families', function (table) {
      table.string('postcode');
      table.string('country');
    })
};

exports.down = function(knex) {
  return knex.schema
    .table('families', function (table) {
      table.dropColumn('postcode');
      table.dropColumn('country');
    })
};
