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
exports.UserConfigController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const user_config_schema_1 = require("./schemas/user-config.schema");
let UserConfigController = class UserConfigController {
    userConfigModel;
    constructor(userConfigModel) {
        this.userConfigModel = userConfigModel;
    }
    async getConfig(req) {
        let config = await this.userConfigModel.findOne({ userId: req.user.userId }).exec();
        if (!config) {
            return {
                dashboardLayout: [
                    { id: 'leads-status', type: 'chart', component: 'LeadsByStatus', title: 'Leads by Status', layout: { x: 0, y: 0, w: 6, h: 4 } },
                    { id: 'sales-trend', type: 'chart', component: 'SalesTrend', title: 'Sales Trend', layout: { x: 6, y: 0, w: 6, h: 4 } },
                    { id: 'deals-stage', type: 'chart', component: 'DealsByStage', title: 'Deals by Stage', layout: { x: 0, y: 4, w: 12, h: 4 } }
                ],
                savedReports: []
            };
        }
        return config;
    }
    async updateConfig(req, configDto) {
        return this.userConfigModel.findOneAndUpdate({ userId: req.user.userId }, { ...configDto, userId: req.user.userId }, { upsert: true, new: true }).exec();
    }
};
exports.UserConfigController = UserConfigController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserConfigController.prototype, "getConfig", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserConfigController.prototype, "updateConfig", null);
exports.UserConfigController = UserConfigController = __decorate([
    (0, common_1.Controller)('users/config'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, mongoose_1.InjectModel)(user_config_schema_1.UserConfig.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], UserConfigController);
//# sourceMappingURL=user-config.controller.js.map