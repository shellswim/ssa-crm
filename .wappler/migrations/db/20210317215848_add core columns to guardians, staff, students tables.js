
exports.up = function(knex) {
  return knex.schema
    .table('guardians', function (table) {
      table.string('firstName');
      table.string('lastName');
      table.string('phone');
      table.string('email');
    })
    .table('staff', function (table) {
      table.string('firstName');
      table.string('lastName');
      table.string('phone');
      table.string('email');
    })
    .table('students', function (table) {
      table.string('firstName');
      table.string('lastName');
      table.date('dob');
      table.string('rollSheetComments');
      table.string('rollSheetMedical');
      table.string('additionalMedical');
    })
};

exports.down = function(knex) {
  return knex.schema
    .table('guardians', function (table) {
      table.dropColumn('firstName');
      table.dropColumn('lastName');
      table.dropColumn('phone');
      table.dropColumn('email');
    })
    .table('staff', function (table) {
      table.dropColumn('firstName');
      table.dropColumn('lastName');
      table.dropColumn('phone');
      table.dropColumn('email');
    })
    .table('students', function (table) {
      table.dropColumn('firstName');
      table.dropColumn('lastName');
      table.dropColumn('dob');
      table.dropColumn('rollSheetComments');
      table.dropColumn('rollSheetMedical');
      table.dropColumn('additionalMedical');
    })
};
