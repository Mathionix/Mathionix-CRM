import { Document, Types } from 'mongoose';
export type EmailDocument = Email & Document;
export declare class Email {
    sender: Types.ObjectId;
    recipient: string;
    subject: string;
    body: string;
    module: string;
    entityId: Types.ObjectId;
    status: string;
    meta: any;
}
export declare const EmailSchema: import("mongoose").Schema<Email, import("mongoose").Model<Email, any, any, any, (Document<unknown, any, Email, any, import("mongoose").DefaultSchemaOptions> & Email & {
    _id: Types.ObjectId;
} & {
    __v: number;
} & {
    id: string;
}) | (Document<unknown, any, Email, any, import("mongoose").DefaultSchemaOptions> & Email & {
    _id: Types.ObjectId;
} & {
    __v: number;
}), any, Email>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Email, Document<unknown, {}, Email, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Email & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    sender?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, Email, Document<unknown, {}, Email, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Email & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    recipient?: import("mongoose").SchemaDefinitionProperty<string, Email, Document<unknown, {}, Email, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Email & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    subject?: import("mongoose").SchemaDefinitionProperty<string, Email, Document<unknown, {}, Email, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Email & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    body?: import("mongoose").SchemaDefinitionProperty<string, Email, Document<unknown, {}, Email, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Email & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    module?: import("mongoose").SchemaDefinitionProperty<string, Email, Document<unknown, {}, Email, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Email & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    entityId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, Email, Document<unknown, {}, Email, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Email & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    status?: import("mongoose").SchemaDefinitionProperty<string, Email, Document<unknown, {}, Email, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Email & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    meta?: import("mongoose").SchemaDefinitionProperty<any, Email, Document<unknown, {}, Email, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Email & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, Email>;
