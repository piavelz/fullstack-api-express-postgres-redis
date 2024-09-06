/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('persons',function(table){
        table.increments('person_id').primary
        table.string('person_name')
        table.string('person_lastName')
        table.integer('person_year')
        table.string('person_nationality')
    })

};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('persons')
};
