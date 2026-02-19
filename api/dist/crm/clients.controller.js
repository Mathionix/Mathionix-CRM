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
exports.ClientsController = void 0;
const common_1 = require("@nestjs/common");
const clients_service_1 = require("./clients.service");
const global_search_service_1 = require("./global-search.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const rbac_guard_1 = require("../auth/guards/rbac.guard");
const permissions_decorator_1 = require("../auth/decorators/permissions.decorator");
let ClientsController = class ClientsController {
    clientsService;
    searchService;
    constructor(clientsService, searchService) {
        this.clientsService = clientsService;
        this.searchService = searchService;
    }
    globalSearch(q) {
        return this.searchService.search(q);
    }
    findAll(query) {
        return this.clientsService.findAll(query);
    }
    async create(data) {
        try {
            return await this.clientsService.create(data);
        }
        catch (error) {
            console.error('Client creation error:', error);
            if (error.code === 11000) {
                throw new common_1.ConflictException('A client with this email already exists');
            }
            throw error;
        }
    }
    findOne(id) {
        return this.clientsService.findOne(id);
    }
    update(id, data) {
        return this.clientsService.update(id, data);
    }
    delete(id) {
        return this.clientsService.delete(id);
    }
};
exports.ClientsController = ClientsController;
__decorate([
    (0, common_1.Get)('search'),
    __param(0, (0, common_1.Query)('q')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ClientsController.prototype, "globalSearch", null);
__decorate([
    (0, common_1.Get)('clients'),
    (0, permissions_decorator_1.Permissions)('clients:read'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ClientsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)('clients'),
    (0, permissions_decorator_1.Permissions)('clients:write'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ClientsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('clients/:id'),
    (0, permissions_decorator_1.Permissions)('clients:read'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ClientsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)('clients/:id'),
    (0, permissions_decorator_1.Permissions)('clients:write'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ClientsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)('clients/:id'),
    (0, permissions_decorator_1.Permissions)('clients:write'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ClientsController.prototype, "delete", null);
exports.ClientsController = ClientsController = __decorate([
    (0, common_1.Controller)('crm'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, rbac_guard_1.RbacGuard),
    __metadata("design:paramtypes", [clients_service_1.ClientsService,
        global_search_service_1.GlobalSearchService])
], ClientsController);
//# sourceMappingURL=clients.controller.js.map