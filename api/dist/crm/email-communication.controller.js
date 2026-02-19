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
exports.EmailCommunicationController = void 0;
const common_1 = require("@nestjs/common");
const email_communication_service_1 = require("./email-communication.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const rbac_guard_1 = require("../auth/guards/rbac.guard");
const permissions_decorator_1 = require("../auth/decorators/permissions.decorator");
let EmailCommunicationController = class EmailCommunicationController {
    emailService;
    constructor(emailService) {
        this.emailService = emailService;
    }
    sendEmail(req, data) {
        return this.emailService.sendEmail({
            ...data,
            sender: req.user.userId,
        });
    }
    findByEntity(id) {
        return this.emailService.findByEntity(id);
    }
};
exports.EmailCommunicationController = EmailCommunicationController;
__decorate([
    (0, common_1.Post)('send'),
    (0, permissions_decorator_1.Permissions)('leads:write', 'deals:write', 'contacts:write'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], EmailCommunicationController.prototype, "sendEmail", null);
__decorate([
    (0, common_1.Get)('entity/:id'),
    (0, permissions_decorator_1.Permissions)('leads:read', 'deals:read', 'contacts:read'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], EmailCommunicationController.prototype, "findByEntity", null);
exports.EmailCommunicationController = EmailCommunicationController = __decorate([
    (0, common_1.Controller)('communications/emails'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, rbac_guard_1.RbacGuard),
    __metadata("design:paramtypes", [email_communication_service_1.EmailCommunicationService])
], EmailCommunicationController);
//# sourceMappingURL=email-communication.controller.js.map