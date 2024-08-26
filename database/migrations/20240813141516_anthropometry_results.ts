import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('anthropometry_results', function (table) {
        table.increments().primary();
        table.integer('anthropometry_id').references('id').inTable('anthropometries');
        table.float('bb_u').notNullable();
        table.float('tb_u').notNullable();
        table.float('bb_tb').notNullable();
        table.float('imt_u').notNullable();
        table.float('lk_u').notNullable();
        table.float('lla_u').notNullable();
        table.timestamps(true, true);
    })
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable('anthropometry_results');
}