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
Object.defineProperty(exports, "__esModule", { value: true });
exports.KnowledgeArticleSchema = exports.KnowledgeArticle = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let KnowledgeArticle = class KnowledgeArticle {
    title;
    content;
    category;
    tags;
    author;
    status;
    viewCount;
};
exports.KnowledgeArticle = KnowledgeArticle;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], KnowledgeArticle.prototype, "title", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], KnowledgeArticle.prototype, "content", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'KnowledgeCategory', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], KnowledgeArticle.prototype, "category", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], default: [] }),
    __metadata("design:type", Array)
], KnowledgeArticle.prototype, "tags", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], KnowledgeArticle.prototype, "author", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 'published', enum: ['draft', 'published', 'archived'] }),
    __metadata("design:type", String)
], KnowledgeArticle.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], KnowledgeArticle.prototype, "viewCount", void 0);
exports.KnowledgeArticle = KnowledgeArticle = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], KnowledgeArticle);
exports.KnowledgeArticleSchema = mongoose_1.SchemaFactory.createForClass(KnowledgeArticle);
//# sourceMappingURL=knowledge-article.schema.js.map