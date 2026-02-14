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
const crm_service_1 = require("./crm.service");
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
    findAllOrganizations() { return this.crmService.findAllOrganizations(); }
    findOneOrganization(id) { return this.crmService.findOneOrganization(id); }
    createOrganization(dto) { return this.crmService.createOrganization(dto); }
    updateOrganization(id, dto) { return this.crmService.updateOrganization(id, dto); }
    findAllContacts() { return this.crmService.findAllContacts(); }
    findOneContact(id) { return this.crmService.findOneContact(id); }
    createContact(dto) { return this.crmService.createContact(dto); }
    updateContact(id, dto) { return this.crmService.updateContact(id, dto); }
    findActivities(relatedTo, type) { return this.crmService.findActivities(relatedTo, type); }
    createActivity(dto) { return this.crmService.createActivity(dto); }
    getDashboard(days, owner) {
        return this.crmService.getDashboardStats(days ? parseInt(days) : 30, owner);
    }
};
exports.CRMController = CRMController;
__decorate([
    (0, common_1.Post)('leads'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CRMController.prototype, "createLead", null);
__decorate([
    (0, common_1.Get)('leads'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CRMController.prototype, "findAllLeads", null);
__decorate([
    (0, common_1.Get)('leads/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CRMController.prototype, "findOneLead", null);
__decorate([
    (0, common_1.Put)('leads/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], CRMController.prototype, "updateLead", null);
__decorate([
    (0, common_1.Get)('deals'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CRMController.prototype, "findAllDeals", null);
__decorate([
    (0, common_1.Get)('deals/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CRMController.prototype, "findOneDeal", null);
__decorate([
    (0, common_1.Post)('deals'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CRMController.prototype, "createDeal", null);
__decorate([
    (0, common_1.Put)('deals/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], CRMController.prototype, "updateDeal", null);
__decorate([
    (0, common_1.Get)('organizations'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CRMController.prototype, "findAllOrganizations", null);
__decorate([
    (0, common_1.Get)('organizations/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CRMController.prototype, "findOneOrganization", null);
__decorate([
    (0, common_1.Post)('organizations'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CRMController.prototype, "createOrganization", null);
__decorate([
    (0, common_1.Put)('organizations/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], CRMController.prototype, "updateOrganization", null);
__decorate([
    (0, common_1.Get)('contacts'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CRMController.prototype, "findAllContacts", null);
__decorate([
    (0, common_1.Get)('contacts/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CRMController.prototype, "findOneContact", null);
__decorate([
    (0, common_1.Post)('contacts'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CRMController.prototype, "createContact", null);
__decorate([
    (0, common_1.Put)('contacts/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], CRMController.prototype, "updateContact", null);
__decorate([
    (0, common_1.Get)('activities'),
    __param(0, (0, common_1.Query)('relatedTo')),
    __param(1, (0, common_1.Query)('type')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], CRMController.prototype, "findActivities", null);
__decorate([
    (0, common_1.Post)('activities'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CRMController.prototype, "createActivity", null);
__decorate([
    (0, common_1.Get)('dashboard'),
    __param(0, (0, common_1.Query)('days')),
    __param(1, (0, common_1.Query)('owner')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], CRMController.prototype, "getDashboard", null);
exports.CRMController = CRMController = __decorate([
    (0, common_1.Controller)('crm'),
    __metadata("design:paramtypes", [crm_service_1.CRMService])
], CRMController);
//# sourceMappingURL=crm.controller.js.map