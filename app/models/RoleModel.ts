import BaseModel from "./Model";

export type RoleType = {
    id: number;
    role_name: string;
}
export class RoleModel extends BaseModel {
    static tableName = 'roles';

    id!: number;
    role_name!: string;
}