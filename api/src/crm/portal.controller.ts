import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Deal, DealDocument } from './schemas/deal.schema';
import { PaymentTerm, PaymentTermDocument } from './schemas/payment-term.schema';

@Controller('portal')
export class PortalController {
    constructor(
        @InjectModel(Deal.name) private dealModel: Model<DealDocument>,
        @InjectModel(PaymentTerm.name) private paymentTermModel: Model<PaymentTermDocument>,
    ) { }

    @Get(':token')
    async getPortalData(@Param('token') token: string) {
        const deal = await this.dealModel.findOne({ portalToken: token })
            .populate('organization')
            .exec();

        if (!deal) {
            throw new NotFoundException('Invalid portal token');
        }

        const payments = await this.paymentTermModel.find({ deal: deal._id }).exec();

        return {
            deal,
            payments
        };
    }
}
