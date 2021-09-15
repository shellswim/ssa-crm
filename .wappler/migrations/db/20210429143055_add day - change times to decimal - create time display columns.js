
exports.up = function(knex) {
  return knex.schema
    .table('classes', function (table) {
      table.renameColumn('startTime', 'startTimeDecimal');
      table.renameColumn('endTime', 'endTimeDecimal');
      table.integer('day').unsigned();
      table.foreign('day').references('id').inTable('days');
      table.string('startTimeDisplay');
      table.string('endTimeDisplay');
    })
};

exports.down = function(knex) {
  return knex.schema
    .table('classes', function (table) {
      table.renameColumn('startTimeDecimal', 'startTime');
      table.renameColumn('endTimeDecimal', 'endTime');
      table.dropForeign('day');
      table.dropColumn('day');
      table.dropColumn('startTimeDisplay');
      table.dropColumn('endTimeDisplay');
    })
};
