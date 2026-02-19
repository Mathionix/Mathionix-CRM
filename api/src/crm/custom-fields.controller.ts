import { Controller, Get, Post, Body, Param, Put, Delete, Query, UseGuards } from '@nestjs/common';
import { CustomFieldsService } from './custom-fields.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RbacGuard } from '../auth/guards/rbac.guard';
import { Permissions } from '../auth/decorators/permissions.decorator';

@Controller('custom-fields')
@UseGuards(JwtAuthGuard, RbacGuard)
export class CustomFieldsController {
    constructor(private readonly customFieldsService: CustomFieldsService) { }

    @Post()
    @Permissions('settings:write')
    create(@Body() createDto: any) {
        return this.customFieldsService.create(createDto);
    }

    @Get()
    @Permissions('leads:read', 'deals:read', 'contacts:read', 'organizations:read')
    findAll(@Query('module') module: string) {
        return this.customFieldsService.findAll(module);
    }

    @Get(':id')
    @Permissions('leads:read', 'deals:read', 'contacts:read', 'organizations:read')
    findOne(@Param('id') id: string) {
        return this.customFieldsService.findOne(id);
    }

    @Put(':id')
    @Permissions('settings:write')
    update(@Param('id') id: string, @Body() updateDto: any) {
        return this.customFieldsService.update(id, updateDto);
    }

    @Delete(':id')
    @Permissions('settings:write')
    remove(@Param('id') id: string) {
        return this.customFieldsService.remove(id);
    }
}
