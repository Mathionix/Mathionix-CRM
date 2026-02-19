import { Document } from 'mongoose';
export type IntegrationDocument = Integration & Document;
export declare class Integration {
    name: string;
    type: string;
    module: string;
    config: Record<string, any>;
    isActive: boolean;
}
export declare const IntegrationSchema: import("mongoose").Schema<Integration, import("mongoose").Model<Integration, any, any, any, (Document<unknown, any, Integration, any, import("mongoose").DefaultSchemaOptions> & Integration & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
} & {
    id: string;
}) | (Document<unknown, any, Integration, any, import("mongoose").DefaultSchemaOptions> & Integration & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}), any, Integration>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Integration, Document<unknown, {}, Integration, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Integration & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    name?: import("mongoose").SchemaDefinitionProperty<string, Integration, Document<unknown, {}, Integration, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Integration & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    type?: import("mongoose").SchemaDefinitionProperty<string, Integration, Document<unknown, {}, Integration, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Integration & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    module?: import("mongoose").SchemaDefinitionProperty<string, Integration, Document<unknown, {}, Integration, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Integration & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    config?: import("mongoose").SchemaDefinitionProperty<Record<string, any>, Integration, Document<unknown, {}, Integration, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Integration & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    isActive?: import("mongoose").SchemaDefinitionProperty<boolean, Integration, Document<unknown, {}, Integration, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Integration & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, Integration>;
