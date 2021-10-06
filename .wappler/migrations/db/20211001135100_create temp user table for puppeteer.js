
exports.up = function(knex) {
  return knex.schema
    .createTable('temp_usr', function (table) {
      table.increments('id');
      table.string('user');
      table.string('password');
    })
};

exports.down = function(knex) {
  return knex.schema
    .dropTable('temp_usr')
};
