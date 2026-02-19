import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { EmailTemplatesService } from './email-templates.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RbacGuard } from '../auth/guards/rbac.guard';
import { Permissions } from '../auth/decorators/permissions.decorator';

@Controller('email-templates')
@UseGuards(JwtAuthGuard, RbacGuard)
export class EmailTemplatesController {
    constructor(private readonly emailTemplatesService: EmailTemplatesService) { }

    @Get()
    @Permissions('settings:write', 'leads:read', 'deals:read', 'contacts:read') // Admins manage, others can use
    findAll(@Query() query: any) {
        return this.emailTemplatesService.findAll(query);
    }

    @Get(':id')
    @Permissions('leads:read', 'deals:read', 'contacts:read')
    findOne(@Param('id') id: string) {
        return this.emailTemplatesService.findOne(id);
    }

    @Post()
    @Permissions('settings:write')
    create(@Request() req: any, @Body() data: any) {
        if (data.type) data.type = data.type.toLowerCase();
        return this.emailTemplatesService.create({ ...data, createdBy: req.user.userId });
    }

    @Put(':id')
    @Permissions('settings:write')
    update(@Param('id') id: string, @Body() data: any) {
        if (data.type) data.type = data.type.toLowerCase();
        return this.emailTemplatesService.update(id, data);
    }

    @Delete(':id')
    @Permissions('settings:write')
    delete(@Param('id') id: string) {
        return this.emailTemplatesService.delete(id);
    }
}
