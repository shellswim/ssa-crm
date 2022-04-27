
exports.up = function(knex) {
  return knex.schema
    .createTable('classLevel_baserates', function (table) {
      table.uuid('uuid');
      table.decimal('baserate');
      table.integer('classLevel_id').unsigned();
      table.foreign('classLevel_id').references('uuid').inTable('classLevels').onUpdate('CASCADE').onDelete('CASCADE');
    })
};

exports.down = function(knex) {
  return knex.schema
    .dropTable('classLevel_baserates')
};
