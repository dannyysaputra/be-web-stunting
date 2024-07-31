import BaseModel from "./Model";

export type ArticleType = {
    id: number;
    title: string;
    content: string;
    link: string;
    poster: string;
    created_by: string;
    created_at: Date;
    updated_at: Date;
}

export class ArticleModel extends BaseModel {
    static tableName: string = "articles";

    id!: number;
    title!: string;
    content!: string;
    link!: string;
    poster!: string;
    created_by!: string;
}