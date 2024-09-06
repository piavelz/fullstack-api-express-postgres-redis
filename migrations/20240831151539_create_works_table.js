/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('works', function(table){
        table.increments('work_id').primary()
        table.string('work_company')
        table.date('work_init_contract')
        table.date('work_finish_contract')
        table.string('work_position'),
        table.integer('work_person').unsigned().references('person_id').inTable('persons')
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema('works')
};
