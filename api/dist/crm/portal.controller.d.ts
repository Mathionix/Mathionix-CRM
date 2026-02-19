import { Model } from 'mongoose';
import { Deal, DealDocument } from './schemas/deal.schema';
import { PaymentTerm, PaymentTermDocument } from './schemas/payment-term.schema';
export declare class PortalController {
    private dealModel;
    private paymentTermModel;
    constructor(dealModel: Model<DealDocument>, paymentTermModel: Model<PaymentTermDocument>);
    getPortalData(token: string): Promise<{
        deal: import("mongoose").Document<unknown, {}, DealDocument, {}, import("mongoose").DefaultSchemaOptions> & Deal & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        };
        payments: (import("mongoose").Document<unknown, {}, PaymentTermDocument, {}, import("mongoose").DefaultSchemaOptions> & PaymentTerm & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        })[];
    }>;
}
