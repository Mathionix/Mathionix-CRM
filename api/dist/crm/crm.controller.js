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
exports.CRMController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const crm_service_1 = require("./crm.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const rbac_guard_1 = require("../auth/guards/rbac.guard");
const permissions_decorator_1 = require("../auth/decorators/permissions.decorator");
let CRMController = class CRMController {
    crmService;
    constructor(crmService) {
        this.crmService = crmService;
    }
    createLead(dto) { return this.crmService.createLead(dto); }
    findAllLeads() { return this.crmService.findAllLeads(); }
    findOneLead(id) { return this.crmService.findOneLead(id); }
    updateLead(id, dto) { return this.crmService.updateLead(id, dto); }
    findAllDeals() { return this.crmService.findAllDeals(); }
    findOneDeal(id) { return this.crmService.findOneDeal(id); }
    createDeal(dto) { return this.crmService.createDeal(dto); }
    updateDeal(id, dto) { return this.crmService.updateDeal(id, dto); }
    findAllOrganizations() {
        return this.crmService.findAllOrganizations();
    }
    findAllOrganizationsList() {
        return this.crmService.findAllOrganizationsList();
    }
    findOneOrganization(id) { return this.crmService.findOneOrganization(id); }
    createOrganization(dto) { return this.crmService.createOrganization(dto); }
    updateOrganization(id, dto) { return this.crmService.updateOrganization(id, dto); }
    findAllContacts() {
        return this.crmService.findAllContacts();
    }
    findAllContactsList() {
        return this.crmService.findAllContactsList();
    }
    findOneContact(id) { return this.crmService.findOneContact(id); }
    createContact(dto) { return this.crmService.createContact(dto); }
    updateContact(id, dto) { return this.crmService.updateContact(id, dto); }
    updateActivity(id, dto) { return this.crmService.updateActivity(id, dto); }
    patchActivity(id, dto) { return this.crmService.updateActivity(id, dto); }
    removeActivity(id) { return this.crmService.removeActivity(id); }
    patchDeal(id, dto) { return this.crmService.updateDeal(id, dto); }
    patchLead(id, dto) { return this.crmService.updateLead(id, dto); }
    patchContact(id, dto) { return this.crmService.updateContact(id, dto); }
    patchOrganization(id, dto) { return this.crmService.updateOrganization(id, dto); }
    async exportData(type) {
        return this.crmService.exportToCsv(type);
    }
    async importData(type, file) {
        return this.crmService.importFromExcel(type, file.buffer);
    }
    findActivities(relatedTo, type) { return this.crmService.findActivities(relatedTo, type); }
    createActivity(dto) { return this.crmService.createActivity(dto); }
    getDashboard(days, owner) {
        return this.crmService.getDashboardStats(days ? parseInt(days) : 30, owner);
    }
    removeLead(id) { return this.crmService.removeLead(id); }
    removeDeal(id) { return this.crmService.removeDeal(id); }
    removeOrganization(id) { return this.crmService.removeOrganization(id); }
    removeContact(id) { return this.crmService.removeContact(id); }
};
exports.CRMController = CRMController;
__decorate([
    (0, common_1.Post)('leads'),
    (0, permissions_decorator_1.Permissions)('leads:write'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CRMController.prototype, "createLead", null);
__decorate([
    (0, common_1.Get)('leads'),
    (0, permissions_decorator_1.Permissions)('leads:read'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CRMController.prototype, "findAllLeads", null);
__decorate([
    (0, common_1.Get)('leads/:id'),
    (0, permissions_decorator_1.Permissions)('leads:read'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CRMController.prototype, "findOneLead", null);
__decorate([
    (0, common_1.Put)('leads/:id'),
    (0, permissions_decorator_1.Permissions)('leads:write'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], CRMController.prototype, "updateLead", null);
__decorate([
    (0, common_1.Get)('deals'),
    (0, permissions_decorator_1.Permissions)('deals:read'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CRMController.prototype, "findAllDeals", null);
__decorate([
    (0, common_1.Get)('deals/:id'),
    (0, permissions_decorator_1.Permissions)('deals:read'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CRMController.prototype, "findOneDeal", null);
__decorate([
    (0, common_1.Post)('deals'),
    (0, permissions_decorator_1.Permissions)('deals:write'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CRMController.prototype, "createDeal", null);
__decorate([
    (0, common_1.Put)('deals/:id'),
    (0, permissions_decorator_1.Permissions)('deals:write'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], CRMController.prototype, "updateDeal", null);
__decorate([
    (0, common_1.Get)('organizations'),
    (0, permissions_decorator_1.Permissions)('orgs:read'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CRMController.prototype, "findAllOrganizations", null);
__decorate([
    (0, common_1.Get)('organizations/list'),
    (0, permissions_decorator_1.Permissions)('orgs:read'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CRMController.prototype, "findAllOrganizationsList", null);
__decorate([
    (0, common_1.Get)('organizations/:id'),
    (0, permissions_decorator_1.Permissions)('orgs:read'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CRMController.prototype, "findOneOrganization", null);
__decorate([
    (0, common_1.Post)('organizations'),
    (0, permissions_decorator_1.Permissions)('orgs:write'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CRMController.prototype, "createOrganization", null);
__decorate([
    (0, common_1.Put)('organizations/:id'),
    (0, permissions_decorator_1.Permissions)('orgs:write'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], CRMController.prototype, "updateOrganization", null);
__decorate([
    (0, common_1.Get)('contacts'),
    (0, permissions_decorator_1.Permissions)('contacts:read'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CRMController.prototype, "findAllContacts", null);
__decorate([
    (0, common_1.Get)('contacts/list'),
    (0, permissions_decorator_1.Permissions)('contacts:read'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CRMController.prototype, "findAllContactsList", null);
__decorate([
    (0, common_1.Get)('contacts/:id'),
    (0, permissions_decorator_1.Permissions)('contacts:read'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CRMController.prototype, "findOneContact", null);
__decorate([
    (0, common_1.Post)('contacts'),
    (0, permissions_decorator_1.Permissions)('contacts:write'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CRMController.prototype, "createContact", null);
__decorate([
    (0, common_1.Put)('contacts/:id'),
    (0, permissions_decorator_1.Permissions)('contacts:write'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], CRMController.prototype, "updateContact", null);
__decorate([
    (0, common_1.Put)('activities/:id'),
    (0, permissions_decorator_1.Permissions)('activities:write'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], CRMController.prototype, "updateActivity", null);
__decorate([
    (0, common_1.Patch)('activities/:id'),
    (0, permissions_decorator_1.Permissions)('activities:write'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], CRMController.prototype, "patchActivity", null);
__decorate([
    (0, common_1.Delete)('activities/:id'),
    (0, permissions_decorator_1.Permissions)('activities:write'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CRMController.prototype, "removeActivity", null);
__decorate([
    (0, common_1.Patch)('deals/:id'),
    (0, permissions_decorator_1.Permissions)('deals:write'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], CRMController.prototype, "patchDeal", null);
__decorate([
    (0, common_1.Patch)('leads/:id'),
    (0, permissions_decorator_1.Permissions)('leads:write'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], CRMController.prototype, "patchLead", null);
__decorate([
    (0, common_1.Patch)('contacts/:id'),
    (0, permissions_decorator_1.Permissions)('contacts:write'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], CRMController.prototype, "patchContact", null);
__decorate([
    (0, common_1.Patch)('organizations/:id'),
    (0, permissions_decorator_1.Permissions)('orgs:write'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], CRMController.prototype, "patchOrganization", null);
__decorate([
    (0, common_1.Get)('export/:type'),
    (0, permissions_decorator_1.Permissions)('leads:read', 'deals:read', 'contacts:read'),
    __param(0, (0, common_1.Param)('type')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CRMController.prototype, "exportData", null);
__decorate([
    (0, common_1.Post)('import/:type'),
    (0, permissions_decorator_1.Permissions)('leads:write', 'deals:write', 'contacts:write'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.Param)('type')),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CRMController.prototype, "importData", null);
__decorate([
    (0, common_1.Get)('activities'),
    (0, permissions_decorator_1.Permissions)('activities:read'),
    __param(0, (0, common_1.Query)('relatedTo')),
    __param(1, (0, common_1.Query)('type')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], CRMController.prototype, "findActivities", null);
__decorate([
    (0, common_1.Post)('activities'),
    (0, permissions_decorator_1.Permissions)('activities:write'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CRMController.prototype, "createActivity", null);
__decorate([
    (0, common_1.Get)('dashboard'),
    (0, permissions_decorator_1.Permissions)('dashboard:read'),
    __param(0, (0, common_1.Query)('days')),
    __param(1, (0, common_1.Query)('owner')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], CRMController.prototype, "getDashboard", null);
__decorate([
    (0, common_1.Delete)('leads/:id'),
    (0, permissions_decorator_1.Permissions)('leads:write'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CRMController.prototype, "removeLead", null);
__decorate([
    (0, common_1.Delete)('deals/:id'),
    (0, permissions_decorator_1.Permissions)('deals:write'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CRMController.prototype, "removeDeal", null);
__decorate([
    (0, common_1.Delete)('organizations/:id'),
    (0, permissions_decorator_1.Permissions)('orgs:write'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CRMController.prototype, "removeOrganization", null);
__decorate([
    (0, common_1.Delete)('contacts/:id'),
    (0, permissions_decorator_1.Permissions)('contacts:write'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CRMController.prototype, "removeContact", null);
exports.CRMController = CRMController = __decorate([
    (0, common_1.Controller)('crm'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, rbac_guard_1.RbacGuard),
    __metadata("design:paramtypes", [crm_service_1.CRMService])
], CRMController);
//# sourceMappingURL=crm.controller.js.map