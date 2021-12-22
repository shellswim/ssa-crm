
exports.up = function(knex) {
  return knex.schema
    .table('families', function (table) {
      table.uuid('uuid').alter();
    })
};

exports.down = function(knex) {
  return knex.schema
    .table('families', function (table) {
      table.string('uuid', 36).alter();
    })
};
