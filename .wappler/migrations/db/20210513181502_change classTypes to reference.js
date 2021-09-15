
exports.up = function(knex) {
  return knex.schema
    .table('classes', function (table) {
      table.integer('classType').alter().unsigned();
    })
};

exports.down = function(knex) {
  return knex.schema
    .table('classes', function (table) {
      table.integer('classType').alter();
    })
};
