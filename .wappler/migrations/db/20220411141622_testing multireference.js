
exports.up = function(knex) {
  return knex.schema
    .createTable('charges_family_charges_enrolments', function (table) {
      table.integer('charges_family_id').unsigned();
      table.foreign('charges_family_id').references('uuid').inTable('charges_family').onUpdate('CASCADE').onDelete('CASCADE');
      table.integer('charges_family_charges_enrolment_id').unsigned();
      table.foreign('charges_family_charges_enrolment_id').references('').inTable('charges_family_charges_enrolments').onUpdate('CASCADE').onDelete('CASCADE');
      table.string('enrolcharge_uuid');
    })
};

exports.down = function(knex) {
  return knex.schema
    .dropTable('charges_family_charges_enrolments')
};
