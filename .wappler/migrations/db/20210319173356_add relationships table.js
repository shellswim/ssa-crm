
exports.up = function(knex) {
  return knex.schema
    .createTable('relationships', function (table) {
      table.increments('id');
      table.string('type');
    })
};

exports.down = function(knex) {
  return knex.schema
    .dropTable('relationships')
};
