import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('articles', function (table) {
        table.increments().primary();
        table.string('title', 255).notNullable();
        table.string('content', 255).notNullable();
        table.string('link', 255).notNullable();
        table.string('poster', 255).notNullable();
        table.uuid('created_by').references('id').inTable('users');
        table.timestamps(true, true);
    })
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable('articles');
}

