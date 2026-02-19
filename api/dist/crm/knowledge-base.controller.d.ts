import { KnowledgeBaseService } from './knowledge-base.service';
export declare class KnowledgeBaseController {
    private readonly knowledgeBaseService;
    constructor(knowledgeBaseService: KnowledgeBaseService);
    findAllCategories(): Promise<import("./schemas/knowledge-category.schema").KnowledgeCategory[]>;
    createCategory(data: any): Promise<import("./schemas/knowledge-category.schema").KnowledgeCategory>;
    findAllArticles(query: any): Promise<import("./schemas/knowledge-article.schema").KnowledgeArticle[]>;
    findOneArticle(id: string): Promise<import("./schemas/knowledge-article.schema").KnowledgeArticle | null>;
    createArticle(req: any, data: any): Promise<import("./schemas/knowledge-article.schema").KnowledgeArticle>;
    updateArticle(id: string, data: any): Promise<import("./schemas/knowledge-article.schema").KnowledgeArticle | null>;
    deleteArticle(id: string): Promise<any>;
}
