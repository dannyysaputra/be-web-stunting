import { Request, Response } from "express";
import { ArticleService } from "../../../services/ArticleService";
import { ArticleType } from "../../../models/ArticleModel";
import { uploadToCloudinary } from "../../../utils/uploadCloudinary";

const articleService = new ArticleService();

export class ArticleController {
    public static async create(req: Request, res: Response): Promise<Response> {
        try {
            const { title, content, link }: ArticleType = req.body;
            const userId = req.user?.id;

            if (!title || !content || !link) {
                return res.status(400).json({
                    status: "Failed",
                    message: "Please provide a valid input"
                })
            }

            if (!req.file) {
                return res.status(400).json({
                    status: "Failed",
                    message: "No image uploaded"
                });
            }

            const image = await uploadToCloudinary(req.file?.buffer, req.file?.mimetype, 'choco/poster');

            if (!image.secure_url) {
                return res.status(500).json({ status: "Failed", message: "Cannot retrieve image from Cloudinary" });
            }

            const article = await articleService.createArticle({
                title,
                content,
                link,
                poster: image.secure_url,
                created_by: userId
            })

            return res.status(201).json({
                status: "Success",
                message: "Article created successfully",
                data: article
            })
        } catch (error) {
            console.error("Internal Error", error);
            return res.status(500).json({ 
                status: "Failed",
                message: "Internal server error",
                error: error 
            });
        }
    }

    public static async getArticles(req: Request, res: Response): Promise<Response> {
        try {
            let articles;

            articles = await articleService.getArticles();

            const title = req.query.title as string;

            if (title) {
                articles = await articleService.findArticleByTitle(title);
            }
            
            return res.status(200).json({
                status: "Success",
                message: "Articles retrieved successfully",
                data: articles
            })
        } catch (error) {
            console.error(error);
            return res.status(500).json({ 
                status: "Failed",
                message: "Internal server error",
                error: error 
            });
        }
    }

    public static async update(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        const articleId = parseInt(id);

        const { title, content, link }: ArticleType = req.body;
        const userId = req.user?.id;

        try {
            const isExist = await articleService.findArticleById(articleId);

            if (!isExist) {
                return res.status(404).json({ status: "Failed", message: "Article not found" });
            }

            let imageUrl: string | undefined;
            if (req.file) {
                const image = await uploadToCloudinary(req.file?.buffer, req.file?.mimetype, 'choco/poster');
                imageUrl = image.secure_url;

                if (!imageUrl) {
                    return res.status(500).json({ status: "Failed", message: 'Cannot retrieve image from Cloudinary' });
                }
            }

            const article = await articleService.updateArticle(articleId, {
                title,
                content,
                link,
                created_by: userId
            }, imageUrl);

            return res.status(201).json({
                status: "Success",
                message: "Article updated successfully",
                data: article
            })
        } catch (error) {
            console.error("Internal Server Error:", error);
            return res.status(500).json({ 
                status: "Failed", 
                message: 'Internal Server Error',
                error: error
            });
        }
    }
}