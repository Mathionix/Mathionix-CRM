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
exports.ColumnPreferencesController = void 0;
const common_1 = require("@nestjs/common");
const column_preferences_service_1 = require("./column-preferences.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let ColumnPreferencesController = class ColumnPreferencesController {
    columnPreferencesService;
    constructor(columnPreferencesService) {
        this.columnPreferencesService = columnPreferencesService;
    }
    getPreference(req, module) {
        return this.columnPreferencesService.getPreference(req.user.userId, module);
    }
    savePreference(req, module, columns) {
        return this.columnPreferencesService.savePreference(req.user.userId, module, columns);
    }
};
exports.ColumnPreferencesController = ColumnPreferencesController;
__decorate([
    (0, common_1.Get)(':module'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('module')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], ColumnPreferencesController.prototype, "getPreference", null);
__decorate([
    (0, common_1.Post)(':module'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('module')),
    __param(2, (0, common_1.Body)('columns')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Array]),
    __metadata("design:returntype", void 0)
], ColumnPreferencesController.prototype, "savePreference", null);
exports.ColumnPreferencesController = ColumnPreferencesController = __decorate([
    (0, common_1.Controller)('column-preferences'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [column_preferences_service_1.ColumnPreferencesService])
], ColumnPreferencesController);
//# sourceMappingURL=column-preferences.controller.js.map