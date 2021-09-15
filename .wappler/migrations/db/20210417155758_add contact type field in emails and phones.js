
exports.up = function(knex) {
  return knex.schema
    .table('emails', function (table) {
      table.integer('type').unsigned();
      table.foreign('type').references('id').inTable('contactTypes');
    })
    .table('phoneNumbers', function (table) {
      table.integer('type').unsigned();
      table.foreign('type').references('id').inTable('contactTypes');
    })
};

exports.down = function(knex) {
  return knex.schema
    .table('emails', function (table) {
      table.dropForeign('type');
      table.dropColumn('type');
    })
    .table('phoneNumbers', function (table) {
      table.dropForeign('type');
      table.dropColumn('type');
    })
};
