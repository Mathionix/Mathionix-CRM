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
exports.PipelineController = void 0;
const common_1 = require("@nestjs/common");
const pipelines_service_1 = require("./pipelines.service");
const reporting_service_1 = require("./reporting.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const rbac_guard_1 = require("../auth/guards/rbac.guard");
const permissions_decorator_1 = require("../auth/decorators/permissions.decorator");
let PipelineController = class PipelineController {
    pipelinesService;
    reportingService;
    constructor(pipelinesService, reportingService) {
        this.pipelinesService = pipelinesService;
        this.reportingService = reportingService;
    }
    findAllPipelines() {
        return this.pipelinesService.findAll();
    }
    createPipeline(data) {
        return this.pipelinesService.create(data);
    }
    getDealStats() {
        return this.reportingService.getDealStats();
    }
    getLeadStats() {
        return this.reportingService.getLeadConversion();
    }
    getActivityStats() {
        return this.reportingService.getActivityTrends();
    }
};
exports.PipelineController = PipelineController;
__decorate([
    (0, common_1.Get)('pipelines'),
    (0, permissions_decorator_1.Permissions)('settings:read'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PipelineController.prototype, "findAllPipelines", null);
__decorate([
    (0, common_1.Post)('pipelines'),
    (0, permissions_decorator_1.Permissions)('settings:write'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PipelineController.prototype, "createPipeline", null);
__decorate([
    (0, common_1.Get)('reports/deals'),
    (0, permissions_decorator_1.Permissions)('settings:read'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PipelineController.prototype, "getDealStats", null);
__decorate([
    (0, common_1.Get)('reports/leads'),
    (0, permissions_decorator_1.Permissions)('settings:read'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PipelineController.prototype, "getLeadStats", null);
__decorate([
    (0, common_1.Get)('reports/activities'),
    (0, permissions_decorator_1.Permissions)('settings:read'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PipelineController.prototype, "getActivityStats", null);
exports.PipelineController = PipelineController = __decorate([
    (0, common_1.Controller)('crm'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, rbac_guard_1.RbacGuard),
    __metadata("design:paramtypes", [pipelines_service_1.PipelinesService,
        reporting_service_1.ReportingService])
], PipelineController);
//# sourceMappingURL=pipeline.controller.js.map