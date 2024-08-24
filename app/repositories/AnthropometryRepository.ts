import { AnthropometryModel, AnthropometryType } from "../models/AnthropometryModel";

export class AnthropometryRepository {
    public async findById(id: number): Promise<AnthropometryType | undefined> {
        return await AnthropometryModel.query().findById(id);
    }

    public async findByUserId(userId: string): Promise<AnthropometryType[] | undefined> {
        return await AnthropometryModel.query().where('user_id', userId).orderBy('name');
    }

    public async create(anthropometry: Partial<AnthropometryType>): Promise<AnthropometryType> {
        return await AnthropometryModel.query().insert(anthropometry);
    }

    public async update(id: number, data: Partial<AnthropometryType>): Promise<AnthropometryType> {
        return await AnthropometryModel.query().patchAndFetchById(id, data);
    }

    public async delete(id: number): Promise<number> {
        return await AnthropometryModel.query().deleteById(id);
    }

    public async getAll(): Promise<AnthropometryType[]> {
        return await AnthropometryModel.query();
    }
}