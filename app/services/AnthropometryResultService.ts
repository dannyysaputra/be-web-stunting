import { AnthropometryResultType } from "../models/AnthropometryResultModel";
import { AnthropometryResultRepository } from "../repositories/AnthropometryResultRepository";

export class AnthropometryResultService {
    private anthropometryResultRepository: AnthropometryResultRepository;

    constructor() {
        this.anthropometryResultRepository = new AnthropometryResultRepository();
    }

    public async createData(data: Partial<AnthropometryResultType>): Promise<AnthropometryResultType> {
        return this.anthropometryResultRepository.create(data);
    }

    public async getAnthropometryResults(): Promise<AnthropometryResultType[]> {
        return this.anthropometryResultRepository.getAll();
    }

    public async updateData(id: number, data: Partial<AnthropometryResultType>): Promise<AnthropometryResultType> {
        return this.anthropometryResultRepository.update(id, data);
    }

    public async deleteData(id: number): Promise<number> {
        return this.anthropometryResultRepository.delete(id);
    }

    public async findDataById(id: number): Promise<AnthropometryResultType | undefined> {
        return this.anthropometryResultRepository.findById(id);
    }

    public async findDataByAnthropometryId(dataId: number): Promise<AnthropometryResultType[] | undefined> {
        return this.anthropometryResultRepository.findByAnthropometryId(dataId);
    }
}