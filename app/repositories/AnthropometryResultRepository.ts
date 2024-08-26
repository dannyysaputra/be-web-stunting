import { AnthropometryResultModel, AnthropometryResultType } from "../models/AnthropometryResultModel";

export class AnthropometryResultRepository {
    public async findById(id: number): Promise<AnthropometryResultType | undefined> {
        return await AnthropometryResultModel.query().findById(id);
    }

    public async findByAnthropometryId(dataId: number): Promise<AnthropometryResultType[] | undefined> {
        return await AnthropometryResultModel.query().where('anthropometry_id', dataId).orderBy('id');
    }

    public async create(data: Partial<AnthropometryResultType>): Promise<AnthropometryResultType> {
        return await AnthropometryResultModel.query().insert(data);
    }

    public async update(id: number, data: Partial<AnthropometryResultType>): Promise<AnthropometryResultType> {
        return await AnthropometryResultModel.query().patchAndFetchById(id, data);
    }

    public async delete(id: number): Promise<number> {
        return await AnthropometryResultModel.query().deleteById(id);
    }

    public async getAll(): Promise<AnthropometryResultType[]> {
        return await AnthropometryResultModel.query();
    }
}