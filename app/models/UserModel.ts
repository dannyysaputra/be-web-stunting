import BaseModel from "./Model";

export type UserType = {
    id: string;
    full_name: string;
    email: string;
    handphone_number: string;
    password: string;
    avatar: string;
    role_id: number;
}

export class UserModel extends BaseModel {
    static tableName: string = "users";

    id!: string;
    full_name!: string;
    email!: string;
    handphone_number!: string;
    password!: string;
    avatar!: string;
    role_id!: number;
}