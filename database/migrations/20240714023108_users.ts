import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('users', function (table) {
        table.uuid('id').primary().defaultTo(knex.fn.uuid());
        table.string('name', 255).notNullable();
        table.string('email', 255).unique().notNullable();
        table.string('handphone_number', 255).notNullable();
        table.string('avatar').nullable();
        table.string('password', 255).notNullable();
        table.integer('role_id').references('id').inTable('roles');
        table.timestamps(true, true);
    })
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable('users');
}

