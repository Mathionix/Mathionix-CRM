import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PaymentTerm, PaymentTermDocument } from './schemas/payment-term.schema';

@Injectable()
export class PaymentTermsService {
    constructor(
        @InjectModel(PaymentTerm.name) private paymentTermModel: Model<PaymentTermDocument>,
    ) { }

    async findByDeal(dealId: string): Promise<PaymentTermDocument[]> {
        return this.paymentTermModel.find({ deal: dealId }).exec();
    }

    async create(dto: any): Promise<PaymentTermDocument> {
        return new this.paymentTermModel(dto).save();
    }

    async update(id: string, dto: any): Promise<PaymentTermDocument | null> {
        return this.paymentTermModel.findByIdAndUpdate(id, dto, { new: true }).exec();
    }

    async remove(id: string): Promise<any> {
        return this.paymentTermModel.findByIdAndDelete(id).exec();
    }
}
