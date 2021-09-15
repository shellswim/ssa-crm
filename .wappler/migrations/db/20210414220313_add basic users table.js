
exports.up = function(knex) {
  return knex.schema
    .createTable('db_users', function (table) {
      table.increments('id');
      table.string('username');
      table.string('password');
    })
};

exports.down = function(knex) {
  return knex.schema
    .dropTable('db_users')
};
