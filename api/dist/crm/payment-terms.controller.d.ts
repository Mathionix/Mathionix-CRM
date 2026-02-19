import { PaymentTermsService } from './payment-terms.service';
export declare class PaymentTermsController {
    private readonly service;
    constructor(service: PaymentTermsService);
    findByDeal(dealId: string): Promise<import("./schemas/payment-term.schema").PaymentTermDocument[]>;
    create(dto: any): Promise<import("./schemas/payment-term.schema").PaymentTermDocument>;
    update(id: string, dto: any): Promise<import("./schemas/payment-term.schema").PaymentTermDocument | null>;
    remove(id: string): Promise<any>;
}
