import { Document, Types } from 'mongoose';
export type ClientDocument = Client & Document;
export declare class Client {
    name: string;
    email: string;
    phone: string;
    organization: Types.ObjectId;
    status: string;
    customFields: Map<string, string>;
    assignedTo: Types.ObjectId[];
}
export declare const ClientSchema: import("mongoose").Schema<Client, import("mongoose").Model<Client, any, any, any, (Document<unknown, any, Client, any, import("mongoose").DefaultSchemaOptions> & Client & {
    _id: Types.ObjectId;
} & {
    __v: number;
} & {
    id: string;
}) | (Document<unknown, any, Client, any, import("mongoose").DefaultSchemaOptions> & Client & {
    _id: Types.ObjectId;
} & {
    __v: number;
}), any, Client>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Client, Document<unknown, {}, Client, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Client & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    name?: import("mongoose").SchemaDefinitionProperty<string, Client, Document<unknown, {}, Client, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Client & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    email?: import("mongoose").SchemaDefinitionProperty<string, Client, Document<unknown, {}, Client, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Client & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    phone?: import("mongoose").SchemaDefinitionProperty<string, Client, Document<unknown, {}, Client, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Client & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    organization?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, Client, Document<unknown, {}, Client, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Client & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    status?: import("mongoose").SchemaDefinitionProperty<string, Client, Document<unknown, {}, Client, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Client & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    customFields?: import("mongoose").SchemaDefinitionProperty<Map<string, string>, Client, Document<unknown, {}, Client, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Client & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    assignedTo?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId[], Client, Document<unknown, {}, Client, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Client & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, Client>;
