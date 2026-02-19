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
exports.KnowledgeBaseController = void 0;
const common_1 = require("@nestjs/common");
const knowledge_base_service_1 = require("./knowledge-base.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const rbac_guard_1 = require("../auth/guards/rbac.guard");
const permissions_decorator_1 = require("../auth/decorators/permissions.decorator");
let KnowledgeBaseController = class KnowledgeBaseController {
    knowledgeBaseService;
    constructor(knowledgeBaseService) {
        this.knowledgeBaseService = knowledgeBaseService;
    }
    findAllCategories() {
        return this.knowledgeBaseService.findAllCategories();
    }
    createCategory(data) {
        return this.knowledgeBaseService.createCategory(data);
    }
    findAllArticles(query) {
        return this.knowledgeBaseService.findAllArticles(query);
    }
    findOneArticle(id) {
        return this.knowledgeBaseService.findOneArticle(id);
    }
    createArticle(req, data) {
        return this.knowledgeBaseService.createArticle({ ...data, author: req.user.userId });
    }
    updateArticle(id, data) {
        return this.knowledgeBaseService.updateArticle(id, data);
    }
    deleteArticle(id) {
        return this.knowledgeBaseService.deleteArticle(id);
    }
};
exports.KnowledgeBaseController = KnowledgeBaseController;
__decorate([
    (0, common_1.Get)('categories'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], KnowledgeBaseController.prototype, "findAllCategories", null);
__decorate([
    (0, common_1.Post)('categories'),
    (0, permissions_decorator_1.Permissions)('settings:write'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], KnowledgeBaseController.prototype, "createCategory", null);
__decorate([
    (0, common_1.Get)('articles'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], KnowledgeBaseController.prototype, "findAllArticles", null);
__decorate([
    (0, common_1.Get)('articles/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], KnowledgeBaseController.prototype, "findOneArticle", null);
__decorate([
    (0, common_1.Post)('articles'),
    (0, permissions_decorator_1.Permissions)('settings:write'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], KnowledgeBaseController.prototype, "createArticle", null);
__decorate([
    (0, common_1.Put)('articles/:id'),
    (0, permissions_decorator_1.Permissions)('settings:write'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], KnowledgeBaseController.prototype, "updateArticle", null);
__decorate([
    (0, common_1.Delete)('articles/:id'),
    (0, permissions_decorator_1.Permissions)('settings:write'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], KnowledgeBaseController.prototype, "deleteArticle", null);
exports.KnowledgeBaseController = KnowledgeBaseController = __decorate([
    (0, common_1.Controller)('knowledge-base'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, rbac_guard_1.RbacGuard),
    __metadata("design:paramtypes", [knowledge_base_service_1.KnowledgeBaseService])
], KnowledgeBaseController);
//# sourceMappingURL=knowledge-base.controller.js.map