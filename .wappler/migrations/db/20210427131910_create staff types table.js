
exports.up = function(knex) {
  return knex.schema
    .createTable('staffTypes', function (table) {
      table.increments('id');
      table.string('name');
      table.boolean('isactive');
    })
};

exports.down = function(knex) {
  return knex.schema
    .dropTable('staffTypes')
};
