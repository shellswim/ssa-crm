
exports.up = function(knex) {
  return knex.schema
    .table('classes', function (table) {
      table.dropColumn('instructor');
      table.dropColumn('classLevel');
      table.integer('instructor2').unsigned();
      table.foreign('instructor2').references('id').inTable('staff');
      table.integer('classLevel2').unsigned();
      table.foreign('classLevel2').references('id').inTable('classLevels');
    })
};

exports.down = function(knex) {
  return knex.schema
    .table('classes', function (table) {
      table.integer('instructor').notNullable();
      table.integer('classLevel').notNullable();
      table.dropForeign('instructor2');
      table.dropColumn('instructor2');
      table.dropForeign('classLevel2');
      table.dropColumn('classLevel2');
    })
};
