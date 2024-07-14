import { UserModel, UserType } from "../models/UserModel";

export class UserRepository {
    public async findByEmail(email: string): Promise<UserType | undefined> {
        return await UserModel.query().findOne({ email });
    }

    public async findById(id: string): Promise<UserType | undefined> {
        return await UserModel.query().findById(id);
    }

    public async createUser(user: Partial<UserType>): Promise<UserType> {
        return await UserModel.query().insert(user);
    }

    public async updateUser(id: string, user: Partial<UserType>): Promise<UserType> {
        return await UserModel.query().patchAndFetchById(id, user);
    }

    public async deleteUser(id: string): Promise<number> {
        return await UserModel.query().deleteById(id);
    }
}