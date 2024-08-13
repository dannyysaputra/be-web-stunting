import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('anthropometries', function (table) {
        table.increments().primary();
        table.string('name', 255).notNullable();
        table.date('measurement_date').notNullable();
        table.date('birth_date').notNullable();
        table.string('gender').notNullable();
        table.float('weight').notNullable();
        table.float('height').notNullable();
        table.float('head_circumference').notNullable();
        table.float('arm_circumference').notNullable();
        table.uuid('user_id').references('id').inTable('users');
        table.timestamps(true, true);
    })
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable('anthropometries');
}

