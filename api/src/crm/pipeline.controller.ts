import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards } from '@nestjs/common';
import { PipelinesService } from './pipelines.service';
import { ReportingService } from './reporting.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RbacGuard } from '../auth/guards/rbac.guard';
import { Permissions } from '../auth/decorators/permissions.decorator';

@Controller('crm')
@UseGuards(JwtAuthGuard, RbacGuard)
export class PipelineController {
    constructor(
        private readonly pipelinesService: PipelinesService,
        private readonly reportingService: ReportingService
    ) { }

    @Get('pipelines')
    @Permissions('settings:read')
    findAllPipelines() {
        return this.pipelinesService.findAll();
    }

    @Post('pipelines')
    @Permissions('settings:write')
    createPipeline(@Body() data: any) {
        return this.pipelinesService.create(data);
    }

    @Get('reports/deals')
    @Permissions('settings:read')
    getDealStats() {
        return this.reportingService.getDealStats();
    }

    @Get('reports/leads')
    @Permissions('settings:read')
    getLeadStats() {
        return this.reportingService.getLeadConversion();
    }

    @Get('reports/activities')
    @Permissions('settings:read')
    getActivityStats() {
        return this.reportingService.getActivityTrends();
    }
}
