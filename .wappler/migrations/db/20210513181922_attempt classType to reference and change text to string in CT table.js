
exports.up = function(knex) {
  return knex.schema
    .table('classes', function (table) {
      table.integer('classType').alter().unsigned();
    })
    .table('classTypes', function (table) {
      table.string('longName', 255).alter();
      table.string('shortName', 255).alter();
    })
};

exports.down = function(knex) {
  return knex.schema
    .table('classes', function (table) {
      table.integer('classType').alter();
    })
    .table('classTypes', function (table) {
      table.text('longName', 65535).alter();
      table.text('shortName', 65535).alter();
    })
};
