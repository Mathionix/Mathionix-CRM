import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, ConflictException } from '@nestjs/common';
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
    @Permissions('clients:read')
    findAll(@Query() query: any) {
        return this.clientsService.findAll(query);
    }

    @Post('clients')
    @Permissions('clients:write')
    async create(@Body() data: any) {
        try {
            return await this.clientsService.create(data);
        } catch (error: any) {
            console.error('Client creation error:', error);
            if (error.code === 11000) {
                throw new ConflictException('A client with this email already exists');
            }
            throw error;
        }
    }

    @Get('clients/:id')
    @Permissions('clients:read')
    findOne(@Param('id') id: string) {
        return this.clientsService.findOne(id);
    }

    @Put('clients/:id')
    @Permissions('clients:write')
    update(@Param('id') id: string, @Body() data: any) {
        return this.clientsService.update(id, data);
    }

    @Delete('clients/:id')
    @Permissions('clients:write')
    delete(@Param('id') id: string) {
        return this.clientsService.delete(id);
    }
}
