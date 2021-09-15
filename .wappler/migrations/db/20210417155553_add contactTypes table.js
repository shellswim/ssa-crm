
exports.up = function(knex) {
  return knex.schema
    .createTable('contactTypes', function (table) {
      table.increments('id');
      table.string('type');
      table.string('match').defaultTo('all').comment('Can be phone, email, all.');
    })
};

exports.down = function(knex) {
  return knex.schema
    .dropTable('contactTypes')
};
