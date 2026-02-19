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
exports.CustomFieldsController = void 0;
const common_1 = require("@nestjs/common");
const custom_fields_service_1 = require("./custom-fields.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const rbac_guard_1 = require("../auth/guards/rbac.guard");
const permissions_decorator_1 = require("../auth/decorators/permissions.decorator");
let CustomFieldsController = class CustomFieldsController {
    customFieldsService;
    constructor(customFieldsService) {
        this.customFieldsService = customFieldsService;
    }
    create(createDto) {
        return this.customFieldsService.create(createDto);
    }
    findAll(module) {
        return this.customFieldsService.findAll(module);
    }
    findOne(id) {
        return this.customFieldsService.findOne(id);
    }
    update(id, updateDto) {
        return this.customFieldsService.update(id, updateDto);
    }
    remove(id) {
        return this.customFieldsService.remove(id);
    }
};
exports.CustomFieldsController = CustomFieldsController;
__decorate([
    (0, common_1.Post)(),
    (0, permissions_decorator_1.Permissions)('settings:write'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CustomFieldsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, permissions_decorator_1.Permissions)('leads:read', 'deals:read', 'contacts:read', 'organizations:read', 'clients:read'),
    __param(0, (0, common_1.Query)('module')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CustomFieldsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, permissions_decorator_1.Permissions)('leads:read', 'deals:read', 'contacts:read', 'organizations:read', 'clients:read'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CustomFieldsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, permissions_decorator_1.Permissions)('settings:write'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], CustomFieldsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, permissions_decorator_1.Permissions)('settings:write'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CustomFieldsController.prototype, "remove", null);
exports.CustomFieldsController = CustomFieldsController = __decorate([
    (0, common_1.Controller)('custom-fields'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, rbac_guard_1.RbacGuard),
    __metadata("design:paramtypes", [custom_fields_service_1.CustomFieldsService])
], CustomFieldsController);
//# sourceMappingURL=custom-fields.controller.js.map