
exports.up = function(knex) {
  return knex.schema
    .table('guardians', function (table) {
      table.dropColumn('phone');
      table.dropColumn('email');
    })
    .createTable('emails', function (table) {
      table.increments('id');
      table.string('address');
      table.integer('guardianId').unsigned();
      table.foreign('guardianId').references('id').inTable('guardians');
    })
};

exports.down = function(knex) {
  return knex.schema
    .table('guardians', function (table) {
      table.string('phone', 255);
      table.string('email', 255);
    })
    .dropTable('emails')
};
