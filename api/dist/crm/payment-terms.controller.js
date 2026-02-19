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
exports.PaymentTermsController = void 0;
const common_1 = require("@nestjs/common");
const payment_terms_service_1 = require("./payment-terms.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const permissions_decorator_1 = require("../auth/decorators/permissions.decorator");
const rbac_guard_1 = require("../auth/guards/rbac.guard");
let PaymentTermsController = class PaymentTermsController {
    service;
    constructor(service) {
        this.service = service;
    }
    findByDeal(dealId) {
        return this.service.findByDeal(dealId);
    }
    create(dto) {
        return this.service.create(dto);
    }
    update(id, dto) {
        return this.service.update(id, dto);
    }
    remove(id) {
        return this.service.remove(id);
    }
};
exports.PaymentTermsController = PaymentTermsController;
__decorate([
    (0, common_1.Get)('deal/:dealId'),
    (0, permissions_decorator_1.Permissions)('deals:read'),
    __param(0, (0, common_1.Param)('dealId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PaymentTermsController.prototype, "findByDeal", null);
__decorate([
    (0, common_1.Post)(),
    (0, permissions_decorator_1.Permissions)('deals:write'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PaymentTermsController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, permissions_decorator_1.Permissions)('deals:write'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], PaymentTermsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, permissions_decorator_1.Permissions)('deals:write'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PaymentTermsController.prototype, "remove", null);
exports.PaymentTermsController = PaymentTermsController = __decorate([
    (0, common_1.Controller)('crm/payment-terms'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, rbac_guard_1.RbacGuard),
    __metadata("design:paramtypes", [payment_terms_service_1.PaymentTermsService])
], PaymentTermsController);
//# sourceMappingURL=payment-terms.controller.js.map