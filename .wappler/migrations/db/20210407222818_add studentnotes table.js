
exports.up = function(knex) {
  return knex.schema
    .createTable('studentNotes', function (table) {
      table.increments('id');
      table.text('content');
      table.integer('student').unsigned();
      table.foreign('student').references('id').inTable('students');
      table.integer('priority').comment('Range between 1-5. 1 being low and 5 being critical.');
    })
};

exports.down = function(knex) {
  return knex.schema
    .dropTable('studentNotes')
};
