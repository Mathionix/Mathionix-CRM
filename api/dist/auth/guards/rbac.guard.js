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
exports.RbacGuard = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const permissions_decorator_1 = require("../decorators/permissions.decorator");
const users_service_1 = require("../../users/users.service");
let RbacGuard = class RbacGuard {
    reflector;
    usersService;
    constructor(reflector, usersService) {
        this.reflector = reflector;
        this.usersService = usersService;
    }
    async canActivate(context) {
        const requiredPermissions = this.reflector.getAllAndOverride(permissions_decorator_1.PERMISSIONS_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (!requiredPermissions) {
            return true;
        }
        const { user } = context.switchToHttp().getRequest();
        if (!user) {
            return false;
        }
        const dbUser = await this.usersService.findOne(user.email);
        if (!dbUser || !dbUser.isActive) {
            console.log(`RbacGuard: User ${user.email} not found or inactive`);
            throw new common_1.ForbiddenException('User is inactive or not found');
        }
        const userRole = dbUser.roleId;
        const legacyRole = dbUser.role?.toLowerCase();
        console.log(`RbacGuard: Checking access for ${user.email}. Role: ${userRole?.name}, Legacy Role: ${legacyRole}`);
        if ((userRole && (userRole.name === 'Admin' || userRole.name === 'administrator')) ||
            legacyRole === 'admin' || legacyRole === 'administrator') {
            console.log('RbacGuard: Super Admin access granted');
            return true;
        }
        const userPermissions = userRole?.permissions?.map((p) => p.name) || [];
        console.log(`RbacGuard: Required: ${requiredPermissions}, Has: ${userPermissions}`);
        const hasPermission = requiredPermissions.some((permission) => userPermissions.includes(permission));
        if (!hasPermission) {
            console.log('RbacGuard: Insufficient permissions');
            throw new common_1.ForbiddenException('Insufficient permissions');
        }
        return true;
    }
};
exports.RbacGuard = RbacGuard;
exports.RbacGuard = RbacGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector,
        users_service_1.UsersService])
], RbacGuard);
//# sourceMappingURL=rbac.guard.js.map