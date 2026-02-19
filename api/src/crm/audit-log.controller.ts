import { Controller, Get, Param, Query, UseGuards, Request } from '@nestjs/common';
import { AuditLogService } from './audit-log.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RbacGuard } from '../auth/guards/rbac.guard';
import { Permissions } from '../auth/decorators/permissions.decorator';

@Controller('audit-logs')
@UseGuards(JwtAuthGuard, RbacGuard)
export class AuditLogController {
    constructor(private readonly auditLogService: AuditLogService) { }

    @Get()
    @Permissions('admin:read')
    findAll(@Query() query: any) {
        return this.auditLogService.findAll(query);
    }

    @Get('entity/:id')
    @Permissions('leads:read', 'deals:read', 'contacts:read')
    findByEntity(@Param('id') id: string) {
        return this.auditLogService.findByEntity(id);
    }
}
