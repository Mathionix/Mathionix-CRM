import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { KnowledgeArticle, KnowledgeArticleDocument } from './schemas/knowledge-article.schema';
import { KnowledgeCategory, KnowledgeCategoryDocument } from './schemas/knowledge-category.schema';

@Injectable()
export class KnowledgeBaseService {
    constructor(
        @InjectModel(KnowledgeArticle.name) private articleModel: Model<KnowledgeArticleDocument>,
        @InjectModel(KnowledgeCategory.name) private categoryModel: Model<KnowledgeCategoryDocument>,
    ) { }

    // Category Methods
    async createCategory(data: any): Promise<KnowledgeCategory> {
        return new this.categoryModel(data).save();
    }

    async findAllCategories(): Promise<KnowledgeCategory[]> {
        return this.categoryModel.find().sort({ order: 1 }).exec();
    }

    // Article Methods
    async createArticle(data: any): Promise<KnowledgeArticle> {
        return new this.articleModel(data).save();
    }

    async findAllArticles(query: any = {}): Promise<KnowledgeArticle[]> {
        return this.articleModel
            .find({ ...query, status: 'published' })
            .populate('category')
            .populate('author', 'firstName lastName')
            .exec();
    }

    async findOneArticle(id: string): Promise<KnowledgeArticle | null> {
        return this.articleModel
            .findByIdAndUpdate(id, { $inc: { viewCount: 1 } }, { new: true })
            .populate('category')
            .populate('author', 'firstName lastName')
            .exec();
    }

    async updateArticle(id: string, data: any): Promise<KnowledgeArticle | null> {
        return this.articleModel.findByIdAndUpdate(id, data, { new: true }).exec();
    }

    async deleteArticle(id: string): Promise<any> {
        return this.articleModel.findByIdAndDelete(id).exec();
    }
}
