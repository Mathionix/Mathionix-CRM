import { Document, Types } from 'mongoose';
export type EmailTemplateDocument = EmailTemplate & Document;
export declare class EmailTemplate {
    name: string;
    subject: string;
    body: string;
    variables: string[];
    createdBy: Types.ObjectId;
    type: string;
    isActive: boolean;
}
export declare const EmailTemplateSchema: import("mongoose").Schema<EmailTemplate, import("mongoose").Model<EmailTemplate, any, any, any, (Document<unknown, any, EmailTemplate, any, import("mongoose").DefaultSchemaOptions> & EmailTemplate & {
    _id: Types.ObjectId;
} & {
    __v: number;
} & {
    id: string;
}) | (Document<unknown, any, EmailTemplate, any, import("mongoose").DefaultSchemaOptions> & EmailTemplate & {
    _id: Types.ObjectId;
} & {
    __v: number;
}), any, EmailTemplate>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, EmailTemplate, Document<unknown, {}, EmailTemplate, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<EmailTemplate & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    name?: import("mongoose").SchemaDefinitionProperty<string, EmailTemplate, Document<unknown, {}, EmailTemplate, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<EmailTemplate & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    subject?: import("mongoose").SchemaDefinitionProperty<string, EmailTemplate, Document<unknown, {}, EmailTemplate, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<EmailTemplate & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    body?: import("mongoose").SchemaDefinitionProperty<string, EmailTemplate, Document<unknown, {}, EmailTemplate, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<EmailTemplate & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    variables?: import("mongoose").SchemaDefinitionProperty<string[], EmailTemplate, Document<unknown, {}, EmailTemplate, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<EmailTemplate & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    createdBy?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, EmailTemplate, Document<unknown, {}, EmailTemplate, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<EmailTemplate & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    type?: import("mongoose").SchemaDefinitionProperty<string, EmailTemplate, Document<unknown, {}, EmailTemplate, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<EmailTemplate & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    isActive?: import("mongoose").SchemaDefinitionProperty<boolean, EmailTemplate, Document<unknown, {}, EmailTemplate, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<EmailTemplate & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, EmailTemplate>;
