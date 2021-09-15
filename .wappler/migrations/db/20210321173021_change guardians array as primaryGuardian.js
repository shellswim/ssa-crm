
exports.up = function(knex) {
  return knex.schema
    .table('families', function (table) {
      table.renameColumn('guardians', 'primaryGuardian');
    })
};

exports.down = function(knex) {
  return knex.schema
    .table('families', function (table) {
      table.renameColumn('primaryGuardian', 'guardians');
    })
};
