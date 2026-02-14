import { Controller, Get, Post, Body, Param, Put, Query } from '@nestjs/common';
import { CRMService } from './crm.service';

@Controller('crm')
export class CRMController {
    constructor(private readonly crmService: CRMService) { }

    // Leads
    @Post('leads') createLead(@Body() dto: any) { return this.crmService.createLead(dto); }
    @Get('leads') findAllLeads() { return this.crmService.findAllLeads(); }
    @Get('leads/:id') findOneLead(@Param('id') id: string) { return this.crmService.findOneLead(id); }
    @Put('leads/:id') updateLead(@Param('id') id: string, @Body() dto: any) { return this.crmService.updateLead(id, dto); }

    // Deals
    @Get('deals') findAllDeals() { return this.crmService.findAllDeals(); }
    @Get('deals/:id') findOneDeal(@Param('id') id: string) { return this.crmService.findOneDeal(id); }
    @Post('deals') createDeal(@Body() dto: any) { return this.crmService.createDeal(dto); }
    @Put('deals/:id') updateDeal(@Param('id') id: string, @Body() dto: any) { return this.crmService.updateDeal(id, dto); }

    // Organizations
    @Get('organizations') findAllOrganizations() { return this.crmService.findAllOrganizations(); }
    @Get('organizations/:id') findOneOrganization(@Param('id') id: string) { return this.crmService.findOneOrganization(id); }
    @Post('organizations') createOrganization(@Body() dto: any) { return this.crmService.createOrganization(dto); }
    @Put('organizations/:id') updateOrganization(@Param('id') id: string, @Body() dto: any) { return this.crmService.updateOrganization(id, dto); }

    // Contacts
    @Get('contacts') findAllContacts() { return this.crmService.findAllContacts(); }
    @Get('contacts/:id') findOneContact(@Param('id') id: string) { return this.crmService.findOneContact(id); }
    @Post('contacts') createContact(@Body() dto: any) { return this.crmService.createContact(dto); }
    @Put('contacts/:id') updateContact(@Param('id') id: string, @Body() dto: any) { return this.crmService.updateContact(id, dto); }

    // Activities (Timeline)
    @Get('activities') findActivities(@Query('relatedTo') relatedTo?: string, @Query('type') type?: string) { return this.crmService.findActivities(relatedTo, type); }
    @Post('activities') createActivity(@Body() dto: any) { return this.crmService.createActivity(dto); }

    @Get('dashboard') getDashboard(@Query('days') days?: string, @Query('owner') owner?: string) {
        return this.crmService.getDashboardStats(days ? parseInt(days) : 30, owner);
    }
}
