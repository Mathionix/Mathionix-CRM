import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { TeamsIntegrationService } from './teams-integration.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RbacGuard } from '../auth/guards/rbac.guard';
import { Permissions } from '../auth/decorators/permissions.decorator';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Controller('crm/integrations')
@UseGuards(JwtAuthGuard, RbacGuard)
export class IntegrationsController {
    constructor(
        private readonly teamsService: TeamsIntegrationService,
        @InjectModel('Integration') private readonly integrationModel: Model<any>
    ) { }

    @Get('whatsapp')
    @Permissions('settings:write')
    async getWhatsAppConfig() {
        return this.integrationModel.findOne({ type: 'whatsapp' }).exec();
    }

    @Post('whatsapp')
    @Permissions('settings:write')
    async saveWhatsAppConfig(@Body() data: any) {
        return this.integrationModel.findOneAndUpdate(
            { type: 'whatsapp' },
            { ...data, type: 'whatsapp' },
            { upsert: true, new: true }
        ).exec();
    }

    @Post('whatsapp/test')
    @Permissions('settings:write')
    async testWhatsApp(@Body('phone') phone: string) {
        // Mock success for now
        return { success: true, message: `Test message sent to ${phone}` };
    }

    @Get('teams')
    @Permissions('settings:write')
    findAllTeams() {
        return this.teamsService.findAll();
    }

    @Post('teams')
    @Permissions('settings:write')
    saveTeams(@Body() data: any) {
        return this.teamsService.saveIntegration(data);
    }
}
