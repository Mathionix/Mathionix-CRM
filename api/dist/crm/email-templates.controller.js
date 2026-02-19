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
exports.EmailTemplatesController = void 0;
const common_1 = require("@nestjs/common");
const email_templates_service_1 = require("./email-templates.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const rbac_guard_1 = require("../auth/guards/rbac.guard");
const permissions_decorator_1 = require("../auth/decorators/permissions.decorator");
let EmailTemplatesController = class EmailTemplatesController {
    emailTemplatesService;
    constructor(emailTemplatesService) {
        this.emailTemplatesService = emailTemplatesService;
    }
    findAll(query) {
        return this.emailTemplatesService.findAll(query);
    }
    findOne(id) {
        return this.emailTemplatesService.findOne(id);
    }
    create(req, data) {
        return this.emailTemplatesService.create({ ...data, createdBy: req.user.userId });
    }
    update(id, data) {
        return this.emailTemplatesService.update(id, data);
    }
    delete(id) {
        return this.emailTemplatesService.delete(id);
    }
};
exports.EmailTemplatesController = EmailTemplatesController;
__decorate([
    (0, common_1.Get)(),
    (0, permissions_decorator_1.Permissions)('settings:write'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], EmailTemplatesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, permissions_decorator_1.Permissions)('leads:read', 'deals:read', 'contacts:read'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], EmailTemplatesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, permissions_decorator_1.Permissions)('settings:write'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], EmailTemplatesController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, permissions_decorator_1.Permissions)('settings:write'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], EmailTemplatesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, permissions_decorator_1.Permissions)('settings:write'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], EmailTemplatesController.prototype, "delete", null);
exports.EmailTemplatesController = EmailTemplatesController = __decorate([
    (0, common_1.Controller)('email-templates'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, rbac_guard_1.RbacGuard),
    __metadata("design:paramtypes", [email_templates_service_1.EmailTemplatesService])
], EmailTemplatesController);
//# sourceMappingURL=email-templates.controller.js.map