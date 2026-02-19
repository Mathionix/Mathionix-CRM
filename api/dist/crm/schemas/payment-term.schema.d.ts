import { Document, Types } from 'mongoose';
export type PaymentTermDocument = PaymentTerm & Document;
export declare class PaymentTerm {
    deal: Types.ObjectId;
    title: string;
    amount: number;
    dueDate: Date;
    status: string;
    notes: string;
}
export declare const PaymentTermSchema: import("mongoose").Schema<PaymentTerm, import("mongoose").Model<PaymentTerm, any, any, any, (Document<unknown, any, PaymentTerm, any, import("mongoose").DefaultSchemaOptions> & PaymentTerm & {
    _id: Types.ObjectId;
} & {
    __v: number;
} & {
    id: string;
}) | (Document<unknown, any, PaymentTerm, any, import("mongoose").DefaultSchemaOptions> & PaymentTerm & {
    _id: Types.ObjectId;
} & {
    __v: number;
}), any, PaymentTerm>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, PaymentTerm, Document<unknown, {}, PaymentTerm, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<PaymentTerm & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    deal?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, PaymentTerm, Document<unknown, {}, PaymentTerm, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<PaymentTerm & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    title?: import("mongoose").SchemaDefinitionProperty<string, PaymentTerm, Document<unknown, {}, PaymentTerm, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<PaymentTerm & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    amount?: import("mongoose").SchemaDefinitionProperty<number, PaymentTerm, Document<unknown, {}, PaymentTerm, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<PaymentTerm & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    dueDate?: import("mongoose").SchemaDefinitionProperty<Date, PaymentTerm, Document<unknown, {}, PaymentTerm, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<PaymentTerm & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    status?: import("mongoose").SchemaDefinitionProperty<string, PaymentTerm, Document<unknown, {}, PaymentTerm, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<PaymentTerm & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    notes?: import("mongoose").SchemaDefinitionProperty<string, PaymentTerm, Document<unknown, {}, PaymentTerm, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<PaymentTerm & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, PaymentTerm>;
