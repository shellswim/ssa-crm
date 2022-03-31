
exports.up = function(knex) {
  return knex.schema
    .createTable('temp_usr_subtemp', function (table) {
      table.increments('id');
      table.integer('temp_usr_id').unsigned();
      table.foreign('temp_usr_id').references('id').inTable('temp_usr').onUpdate('CASCADE').onDelete('CASCADE');
    })
};

exports.down = function(knex) {
  return knex.schema
    .dropTable('temp_usr_subtemp')
};
