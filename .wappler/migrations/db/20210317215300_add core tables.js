
exports.up = function(knex) {
  return knex.schema
    .createTable('families', function (table) {
      table.increments('id');
    })
    .createTable('classes', function (table) {
      table.increments('id');
    })
    .createTable('staff', function (table) {
      table.increments('id');
    })
    .createTable('attendance', function (table) {
      table.increments('id');
    })
    .createTable('classLevels', function (table) {
      table.increments('id');
    })
    .createTable('guardians', function (table) {
      table.increments('id');
    })
};

exports.down = function(knex) {
  return knex.schema
    .dropTable('families')
    .dropTable('classes')
    .dropTable('staff')
    .dropTable('attendance')
    .dropTable('classLevels')
    .dropTable('guardians')
};
