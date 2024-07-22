import { ArticleType } from "../models/ArticleModel";
import { ArticleRepository } from "../repositories/ArticleRepository";

export class ArticleService {
    private articleRepository: ArticleRepository;

    constructor() {
        this.articleRepository = new ArticleRepository();
    }

    public async createArticle(articleData: Partial<ArticleType>): Promise<ArticleType> {
        return this.articleRepository.create(articleData);
    }

    public async getArticles(): Promise<ArticleType[]> {
        return this.articleRepository.getAll();
    }

    public async updateArticle(id: number, articleData: Partial<ArticleType>): Promise<ArticleType> {
        return this.articleRepository.update(id, articleData);
    }


    public async deleteArticle(id: number): Promise<number> {
        return this.articleRepository.delete(id);
    }

    public async findArticleByTitle(title: string): Promise<ArticleType[] | undefined> {
        return this.articleRepository.findByTitle(title);
    }

    public async findArticleById(id: number): Promise<ArticleType | undefined> {
        return this.articleRepository.findById(id);
    }

}