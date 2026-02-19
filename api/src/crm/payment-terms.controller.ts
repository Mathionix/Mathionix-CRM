import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { PaymentTermsService } from './payment-terms.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Permissions } from '../auth/decorators/permissions.decorator';
import { RbacGuard } from '../auth/guards/rbac.guard';

@Controller('crm/payment-terms')
@UseGuards(JwtAuthGuard, RbacGuard)
export class PaymentTermsController {
    constructor(private readonly service: PaymentTermsService) { }

    @Get('deal/:dealId')
    @Permissions('deals:read')
    findByDeal(@Param('dealId') dealId: string) {
        return this.service.findByDeal(dealId);
    }

    @Post()
    @Permissions('deals:write')
    create(@Body() dto: any) {
        return this.service.create(dto);
    }

    @Put(':id')
    @Permissions('deals:write')
    update(@Param('id') id: string, @Body() dto: any) {
        return this.service.update(id, dto);
    }

    @Delete(':id')
    @Permissions('deals:write')
    remove(@Param('id') id: string) {
        return this.service.remove(id);
    }
}
