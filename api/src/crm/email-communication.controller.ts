import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { EmailCommunicationService } from './email-communication.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RbacGuard } from '../auth/guards/rbac.guard';
import { Permissions } from '../auth/decorators/permissions.decorator';

@Controller('communications/emails')
@UseGuards(JwtAuthGuard, RbacGuard)
export class EmailCommunicationController {
    constructor(private readonly emailService: EmailCommunicationService) { }

    @Post('send')
    @Permissions('leads:write', 'deals:write', 'contacts:write')
    sendEmail(@Request() req: any, @Body() data: any) {
        return this.emailService.sendEmail({
            ...data,
            sender: req.user.userId,
        });
    }

    @Get('entity/:id')
    @Permissions('leads:read', 'deals:read', 'contacts:read')
    findByEntity(@Param('id') id: string) {
        return this.emailService.findByEntity(id);
    }
}
