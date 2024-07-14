import BaseModel from "./Model";

export type UserType = {
    id: string;
    name: string;
    email: string;
    handphone_number: string;
    password: string;
    avatar: string;
    role_id: number;
    created_at: Date;
    updated_at: Date;
}

export class UserModel extends BaseModel {
    static tableName: string = "users";

    id!: string;
    name!: string;
    email!: string;
    handphone_number!: string;
    password!: string;
    avatar!: string;
    role_id!: number;
}