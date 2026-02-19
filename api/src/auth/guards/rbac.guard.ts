import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';
import { UsersService } from '../../users/users.service';

@Injectable()
export class RbacGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        private usersService: UsersService,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const requiredPermissions = this.reflector.getAllAndOverride<string[]>(PERMISSIONS_KEY, [
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

        // Fetch user with permissions from DB
        const dbUser = await this.usersService.findOne(user.email);
        if (!dbUser || !dbUser.isActive) {
            console.log(`RbacGuard: User ${user.email} not found or inactive`);
            throw new ForbiddenException('User is inactive or not found');
        }

        // Admin override - if role name is 'Admin', allow everything
        // Note: In a production system, you might want to be more granular even with admins
        const userRole = dbUser.roleId as any;
        const legacyRole = (dbUser as any).role?.toLowerCase();
        console.log(`RbacGuard: Checking access for ${user.email}. Role: ${userRole?.name}, Legacy Role: ${legacyRole}`);

        if ((userRole && (userRole.name === 'Admin' || userRole.name === 'administrator')) ||
            legacyRole === 'admin' || legacyRole === 'administrator') {
            console.log('RbacGuard: Super Admin access granted');
            return true;
        }

        const userPermissions = userRole?.permissions?.map((p: any) => p.name) || [];
        console.log(`RbacGuard: Required: ${requiredPermissions}, Has: ${userPermissions}`);

        const hasPermission = requiredPermissions.some((permission) =>
            userPermissions.includes(permission),
        );

        if (!hasPermission) {
            console.log('RbacGuard: Insufficient permissions');
            throw new ForbiddenException('Insufficient permissions');
        }

        return true;
    }
}
