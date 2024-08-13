import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('anthropometry_results', function (table) {
        table.increments().primary();
        table.integer('anthropometry_id').references('id').inTable('anthropometries');
        table.float('bb/u').notNullable();
        table.float('tb/u').notNullable();
        table.float('bb/tb').notNullable();
        table.float('imt/u').notNullable();
        table.timestamps(true, true);
    })
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable('anthropometry_results');
}

