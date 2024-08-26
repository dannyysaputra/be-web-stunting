import BaseModel from "./Model";

export type AnthropometryResultType = {
    id: number;
    anthropometry_id: number;
    bb_u: number;
    tb_u: number;
    bb_tb: number;
    imt_u: number;
    lk_u: number;
    lla_u: number;
    updated_at: Date;
    created_at: Date;
}

export class AnthropometryResultModel extends BaseModel {
    static tableName: string = "anthropometry_results";

    id!: number;
    anthropometry_id!: number;
    bb_u!: number;
    tb_u!: number;
    bb_tb!: number;
    imt_u!: number;
    lk_u!: number;
    lla_u!: number;
}