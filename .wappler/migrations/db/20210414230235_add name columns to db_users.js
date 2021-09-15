
exports.up = function(knex) {
  return knex.schema
    .table('db_users', function (table) {
      table.string('firstName');
      table.string('lastName');
    })
};

exports.down = function(knex) {
  return knex.schema
    .table('db_users', function (table) {
      table.dropColumn('firstName');
      table.dropColumn('lastName');
    })
};
