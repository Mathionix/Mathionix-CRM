"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.KnowledgeBaseService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const knowledge_article_schema_1 = require("./schemas/knowledge-article.schema");
const knowledge_category_schema_1 = require("./schemas/knowledge-category.schema");
let KnowledgeBaseService = class KnowledgeBaseService {
    articleModel;
    categoryModel;
    constructor(articleModel, categoryModel) {
        this.articleModel = articleModel;
        this.categoryModel = categoryModel;
    }
    async createCategory(data) {
        return new this.categoryModel(data).save();
    }
    async findAllCategories() {
        return this.categoryModel.find().sort({ order: 1 }).exec();
    }
    async createArticle(data) {
        return new this.articleModel(data).save();
    }
    async findAllArticles(query = {}) {
        return this.articleModel
            .find({ ...query, status: 'published' })
            .populate('category')
            .populate('author', 'firstName lastName')
            .exec();
    }
    async findOneArticle(id) {
        return this.articleModel
            .findByIdAndUpdate(id, { $inc: { viewCount: 1 } }, { new: true })
            .populate('category')
            .populate('author', 'firstName lastName')
            .exec();
    }
    async updateArticle(id, data) {
        return this.articleModel.findByIdAndUpdate(id, data, { new: true }).exec();
    }
    async deleteArticle(id) {
        return this.articleModel.findByIdAndDelete(id).exec();
    }
};
exports.KnowledgeBaseService = KnowledgeBaseService;
exports.KnowledgeBaseService = KnowledgeBaseService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(knowledge_article_schema_1.KnowledgeArticle.name)),
    __param(1, (0, mongoose_1.InjectModel)(knowledge_category_schema_1.KnowledgeCategory.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], KnowledgeBaseService);
//# sourceMappingURL=knowledge-base.service.js.map