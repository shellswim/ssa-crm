
exports.up = function(knex) {
  return knex.schema
    .createTable('notes', function (table) {
      table.increments('id');
      table.text('content');
      table.integer('priority').comment('Range between 1-5. 1 being low and 5 being critical.');
    })
};

exports.down = function(knex) {
  return knex.schema
    .dropTable('notes')
};
