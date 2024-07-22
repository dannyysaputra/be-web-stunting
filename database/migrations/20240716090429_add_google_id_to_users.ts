import { table } from "console";
import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.table('users', function (table) {
        table.string('google_id');
    })
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.table('users', function (table) {
        table.dropColumn('google_id');
    })
}

