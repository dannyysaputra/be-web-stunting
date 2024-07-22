import { ArticleModel, ArticleType } from "../models/ArticleModel";

export class ArticleRepository {
    public async findByTitle(title: string): Promise<ArticleType | undefined> {
        return await ArticleModel.query().findOne({ title });
    }

    public async findById(id: number): Promise<ArticleType | undefined> {
        return await ArticleModel.query().findById(id);
    }

    public async create(article: Partial<ArticleType>): Promise<ArticleType> {
        return await ArticleModel.query().insert(article);
    }

    public async update(id: number, article: Partial<ArticleType>): Promise<ArticleType> {
        return await ArticleModel.query().patchAndFetchById(id, article);
    }

    public async delete(id: number): Promise<number> {
        return await ArticleModel.query().deleteById(id);
    }

    public async getAll(): Promise<ArticleType[]> {
        return await ArticleModel.query();
    }
}