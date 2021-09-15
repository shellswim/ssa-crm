
exports.up = function(knex) {
  return knex('days').insert({"name":"Monday"})
    .then(() => {return knex('days').insert({"name":"Tuesday"})})
    .then(() => {return knex('days').insert({"name":"Wednesday"})})
    .then(() => {return knex('days').insert({"name":"Thursday"})})
    .then(() => {return knex('days').insert({"name":"Friday"})})
    .then(() => {return knex('days').insert({"name":"Saturday"})})
    .then(() => {return knex('days').insert({"name":"Sunday"})})
};

exports.down = function(knex) {
};
