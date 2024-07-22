import { RoleModel, RoleType } from "../models/RoleModel";

export class RoleRepository {
    public async findByName(role_name: string): Promise<RoleType | undefined> {
        return await RoleModel.query().findOne({ role_name });
    }

    public async findById(id: number): Promise<RoleType | undefined> {
        return await RoleModel.query().findById(id);
    }

    public async createRole(role: Partial<RoleType>): Promise<RoleType> {
        return await RoleModel.query().insert(role);
    }
}