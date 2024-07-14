import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('roles', function (table) {
        table.increments('id').primary();
        table.string('role_name', 255).notNullable();
    })
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable('roles');
}

