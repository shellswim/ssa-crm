
exports.up = function(knex) {
  return knex.schema
    .table('families', function (table) {
      table.uuid('uuid').comment('families uuid column for later use').alter();
    })
};

exports.down = function(knex) {
  return knex.schema
    .table('families', function (table) {
      table.string('uuid', 36).comment('').alter();
    })
};
