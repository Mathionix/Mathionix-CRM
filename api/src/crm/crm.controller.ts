import { Controller, Get, Post, Body, Param, Put, Patch, Query, UseGuards, UseInterceptors, UploadedFile, Delete } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CRMService } from './crm.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RbacGuard } from '../auth/guards/rbac.guard';
import { Permissions } from '../auth/decorators/permissions.decorator';

@Controller('crm')
@UseGuards(JwtAuthGuard, RbacGuard)
export class CRMController {
    constructor(private readonly crmService: CRMService) { }

    // Leads
    @Post('leads')
    @Permissions('leads:write')
    createLead(@Body() dto: any) { return this.crmService.createLead(dto); }

    @Get('leads')
    @Permissions('leads:read')
    findAllLeads() { return this.crmService.findAllLeads(); }

    @Get('leads/:id')
    @Permissions('leads:read')
    findOneLead(@Param('id') id: string) { return this.crmService.findOneLead(id); }

    @Put('leads/:id')
    @Permissions('leads:write')
    updateLead(@Param('id') id: string, @Body() dto: any) { return this.crmService.updateLead(id, dto); }

    // Deals
    @Get('deals')
    @Permissions('deals:read')
    findAllDeals() { return this.crmService.findAllDeals(); }

    @Get('deals/:id')
    @Permissions('deals:read')
    findOneDeal(@Param('id') id: string) { return this.crmService.findOneDeal(id); }

    @Post('deals')
    @Permissions('deals:write')
    createDeal(@Body() dto: any) { return this.crmService.createDeal(dto); }

    @Put('deals/:id')
    @Permissions('deals:write')
    updateDeal(@Param('id') id: string, @Body() dto: any) { return this.crmService.updateDeal(id, dto); }

    // Organizations
    @Get('organizations')
    @Permissions('orgs:read')
    findAllOrganizations() {
        return this.crmService.findAllOrganizations();
    }

    @Get('organizations/list')
    @Permissions('orgs:read')
    findAllOrganizationsList() {
        return this.crmService.findAllOrganizationsList();
    }

    @Get('organizations/:id')
    @Permissions('orgs:read')
    findOneOrganization(@Param('id') id: string) { return this.crmService.findOneOrganization(id); }

    @Post('organizations')
    @Permissions('orgs:write')
    createOrganization(@Body() dto: any) { return this.crmService.createOrganization(dto); }

    @Put('organizations/:id')
    @Permissions('orgs:write')
    updateOrganization(@Param('id') id: string, @Body() dto: any) { return this.crmService.updateOrganization(id, dto); }

    // Contacts
    @Get('contacts')
    @Permissions('contacts:read')
    findAllContacts() {
        return this.crmService.findAllContacts();
    }

    @Get('contacts/list')
    @Permissions('contacts:read')
    findAllContactsList() {
        return this.crmService.findAllContactsList();
    }

    @Get('contacts/:id')
    @Permissions('contacts:read')
    findOneContact(@Param('id') id: string) { return this.crmService.findOneContact(id); }

    @Post('contacts')
    @Permissions('contacts:write')
    createContact(@Body() dto: any) { return this.crmService.createContact(dto); }

    @Put('contacts/:id')
    @Permissions('contacts:write')
    updateContact(@Param('id') id: string, @Body() dto: any) { return this.crmService.updateContact(id, dto); }

    @Put('activities/:id')
    @Permissions('activities:write')
    updateActivity(@Param('id') id: string, @Body() dto: any) { return this.crmService.updateActivity(id, dto); }

    @Patch('activities/:id')
    @Permissions('activities:write')
    patchActivity(@Param('id') id: string, @Body() dto: any) { return this.crmService.updateActivity(id, dto); }

    @Delete('activities/:id')
    @Permissions('activities:write')
    removeActivity(@Param('id') id: string) { return this.crmService.removeActivity(id); }

    @Patch('deals/:id')
    @Permissions('deals:write')
    patchDeal(@Param('id') id: string, @Body() dto: any) { return this.crmService.updateDeal(id, dto); }

    @Patch('leads/:id')
    @Permissions('leads:write')
    patchLead(@Param('id') id: string, @Body() dto: any) { return this.crmService.updateLead(id, dto); }

    @Patch('contacts/:id')
    @Permissions('contacts:write')
    patchContact(@Param('id') id: string, @Body() dto: any) { return this.crmService.updateContact(id, dto); }

    @Patch('organizations/:id')
    @Permissions('orgs:write')
    patchOrganization(@Param('id') id: string, @Body() dto: any) { return this.crmService.updateOrganization(id, dto); }

    // Export Endpoints
    @Get('export/:type')
    @Permissions('leads:read', 'deals:read', 'contacts:read')
    async exportData(@Param('type') type: string) {
        return this.crmService.exportToCsv(type);
    }

    @Post('import/:type')
    @Permissions('leads:write', 'deals:write', 'contacts:write')
    @UseInterceptors(FileInterceptor('file'))
    async importData(@Param('type') type: string, @UploadedFile() file: any) {
        return this.crmService.importFromExcel(type, file.buffer);
    }

    // Activities (Timeline)
    @Get('activities')
    @Permissions('activities:read')
    findActivities(@Query('relatedTo') relatedTo?: string, @Query('type') type?: string) { return this.crmService.findActivities(relatedTo, type); }

    @Post('activities')
    @Permissions('activities:write')
    createActivity(@Body() dto: any) { return this.crmService.createActivity(dto); }

    @Get('dashboard')
    @Permissions('dashboard:read')
    getDashboard(@Query('days') days?: string, @Query('owner') owner?: string) {
        return this.crmService.getDashboardStats(days ? parseInt(days) : 30, owner);
    }

    // --- Deletion ---
    @Delete('leads/:id')
    @Permissions('leads:write')
    removeLead(@Param('id') id: string) { return this.crmService.removeLead(id); }

    @Delete('deals/:id')
    @Permissions('deals:write')
    removeDeal(@Param('id') id: string) { return this.crmService.removeDeal(id); }

    @Delete('organizations/:id')
    @Permissions('orgs:write')
    removeOrganization(@Param('id') id: string) { return this.crmService.removeOrganization(id); }

    @Delete('contacts/:id')
    @Permissions('contacts:write')
    removeContact(@Param('id') id: string) { return this.crmService.removeContact(id); }
}
