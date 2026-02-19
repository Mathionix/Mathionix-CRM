import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { GlobalSearchService } from './global-search.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RbacGuard } from '../auth/guards/rbac.guard';
import { Permissions } from '../auth/decorators/permissions.decorator';

@Controller('crm')
@UseGuards(JwtAuthGuard, RbacGuard)
export class ClientsController {
    constructor(
        private readonly clientsService: ClientsService,
        private readonly searchService: GlobalSearchService
    ) { }

    @Get('search')
    globalSearch(@Query('q') q: string) {
        return this.searchService.search(q);
    }

    @Get('clients')
    @Permissions('contacts:read')
    findAll() {
        return this.clientsService.findAll();
    }

    @Post('clients')
    @Permissions('contacts:write')
    create(@Body() data: any) {
        return this.clientsService.create(data);
    }

    @Get('clients/:id')
    @Permissions('contacts:read')
    findOne(@Param('id') id: string) {
        return this.clientsService.findOne(id);
    }

    @Put('clients/:id')
    @Permissions('contacts:write')
    update(@Param('id') id: string, @Body() data: any) {
        return this.clientsService.update(id, data);
    }

    @Delete('clients/:id')
    @Permissions('contacts:write')
    delete(@Param('id') id: string) {
        return this.clientsService.delete(id);
    }
}
