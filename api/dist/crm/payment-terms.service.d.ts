import { Model } from 'mongoose';
import { PaymentTermDocument } from './schemas/payment-term.schema';
export declare class PaymentTermsService {
    private paymentTermModel;
    constructor(paymentTermModel: Model<PaymentTermDocument>);
    findByDeal(dealId: string): Promise<PaymentTermDocument[]>;
    create(dto: any): Promise<PaymentTermDocument>;
    update(id: string, dto: any): Promise<PaymentTermDocument | null>;
    remove(id: string): Promise<any>;
}
