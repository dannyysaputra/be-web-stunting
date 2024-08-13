import { AnthropometryType } from "../models/AnthropometryModel";
import { AnthropometryRepository } from "../repositories/AnthropometryRepository";

export class AnthropometryService {
    private anthropometryRepository: AnthropometryRepository;

    constructor() {
        this.anthropometryRepository = new AnthropometryRepository();
    }

    public async createData(data: Partial<AnthropometryType>): Promise<AnthropometryType> {
        return this.anthropometryRepository.create(data);
    }

    public async getAnthropometries(): Promise<AnthropometryType[]> {
        return this.anthropometryRepository.getAll();
    }

    public async updateData(id: number, data: Partial<AnthropometryType>): Promise<AnthropometryType> {
        return this.anthropometryRepository.update(id, data);
    }

    public async deleteData(id: number): Promise<number> {
        return this.anthropometryRepository.delete(id);
    }

    public async findDataById(id: number): Promise<AnthropometryType | undefined> {
        return this.anthropometryRepository.findById(id);
    }

    public async findDataByUserId(userId: string): Promise<AnthropometryType[] | undefined> {
        return this.anthropometryRepository.findByUserId(userId);
    }
}