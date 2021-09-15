
exports.up = function(knex) {
  return knex.schema
    .table('classes', function (table) {
      table.renameColumn('instructor2', 'instructor');
      table.renameColumn('classLevel2', 'classLevel');
    })
};

exports.down = function(knex) {
  return knex.schema
    .table('classes', function (table) {
      table.renameColumn('instructor', 'instructor2');
      table.renameColumn('classLevel', 'classLevel2');
    })
};
