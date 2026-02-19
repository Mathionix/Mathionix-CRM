import { Model } from 'mongoose';
import { KnowledgeArticle, KnowledgeArticleDocument } from './schemas/knowledge-article.schema';
import { KnowledgeCategory, KnowledgeCategoryDocument } from './schemas/knowledge-category.schema';
export declare class KnowledgeBaseService {
    private articleModel;
    private categoryModel;
    constructor(articleModel: Model<KnowledgeArticleDocument>, categoryModel: Model<KnowledgeCategoryDocument>);
    createCategory(data: any): Promise<KnowledgeCategory>;
    findAllCategories(): Promise<KnowledgeCategory[]>;
    createArticle(data: any): Promise<KnowledgeArticle>;
    findAllArticles(query?: any): Promise<KnowledgeArticle[]>;
    findOneArticle(id: string): Promise<KnowledgeArticle | null>;
    updateArticle(id: string, data: any): Promise<KnowledgeArticle | null>;
    deleteArticle(id: string): Promise<any>;
}
