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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditLogInterceptor = void 0;
const common_1 = require("@nestjs/common");
const operators_1 = require("rxjs/operators");
const audit_log_service_1 = require("./audit-log.service");
let AuditLogInterceptor = class AuditLogInterceptor {
    auditLogService;
    constructor(auditLogService) {
        this.auditLogService = auditLogService;
    }
    intercept(context, next) {
        const request = context.switchToHttp().getRequest();
        const { method, url, body, user, ip } = request;
        if (['POST', 'PUT', 'DELETE'].includes(method)) {
            return next.handle().pipe((0, operators_1.tap)(async (response) => {
                const module = this.getModuleFromUrl(url);
                const action = this.getActionFromMethod(method);
                if (user && module) {
                    try {
                        await this.auditLogService.logAction({
                            user: user.userId || user._id,
                            action,
                            module,
                            entityId: response?._id || request.params?.id,
                            description: `${action} action performed on ${module}`,
                            ipAddress: ip,
                            userAgent: request.headers['user-agent'],
                            changes: method === 'PUT' ? body : undefined
                        });
                    }
                    catch (err) {
                        console.error('AuditLogInterceptor Error:', err);
                    }
                }
            }));
        }
        return next.handle();
    }
    getModuleFromUrl(url) {
        if (url.includes('/crm/leads'))
            return 'leads';
        if (url.includes('/crm/deals'))
            return 'deals';
        if (url.includes('/crm/organizations'))
            return 'organizations';
        if (url.includes('/crm/contacts'))
            return 'contacts';
        if (url.includes('/crm/clients'))
            return 'clients';
        if (url.includes('/users/roles'))
            return 'roles';
        if (url.includes('/users'))
            return 'users';
        return 'system';
    }
    getActionFromMethod(method) {
        switch (method) {
            case 'POST': return 'create';
            case 'PUT': return 'update';
            case 'DELETE': return 'delete';
            default: return 'action';
        }
    }
};
exports.AuditLogInterceptor = AuditLogInterceptor;
exports.AuditLogInterceptor = AuditLogInterceptor = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [audit_log_service_1.AuditLogService])
], AuditLogInterceptor);
//# sourceMappingURL=audit-log.interceptor.js.map