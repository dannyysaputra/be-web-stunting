import BaseModel from "./Model";

export type AnthropometryType = {
    id: number;
    name: string;
    measurement_date: Date;
    birth_date: Date;
    gender: string;
    weight: number;
    height: number;
    head_circumference: number;
    arm_circumference: number;
    user_id: string;
    created_at: Date;
    updated_at: Date;
}

export class AnthropometryModel extends BaseModel {
    static tableName: string = "anthropometries";

    id!: number;
    name!: string;
    measurement_date!: Date;
    birth_date!: Date;
    gender!: string;
    weight!: number;
    height!: number;
    head_circumference!: number;
    arm_circumference!: number;
    user_id!: string;
}