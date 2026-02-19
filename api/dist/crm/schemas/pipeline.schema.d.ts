import { Document } from 'mongoose';
export type PipelineDocument = Pipeline & Document;
export declare class Pipeline {
    name: string;
    stages: {
        name: string;
        probability: number;
        order: number;
        isDefault: boolean;
    }[];
    isDefault: boolean;
}
export declare const PipelineSchema: import("mongoose").Schema<Pipeline, import("mongoose").Model<Pipeline, any, any, any, (Document<unknown, any, Pipeline, any, import("mongoose").DefaultSchemaOptions> & Pipeline & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
} & {
    id: string;
}) | (Document<unknown, any, Pipeline, any, import("mongoose").DefaultSchemaOptions> & Pipeline & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}), any, Pipeline>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Pipeline, Document<unknown, {}, Pipeline, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Pipeline & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    name?: import("mongoose").SchemaDefinitionProperty<string, Pipeline, Document<unknown, {}, Pipeline, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Pipeline & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    stages?: import("mongoose").SchemaDefinitionProperty<{
        name: string;
        probability: number;
        order: number;
        isDefault: boolean;
    }[], Pipeline, Document<unknown, {}, Pipeline, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Pipeline & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    isDefault?: import("mongoose").SchemaDefinitionProperty<boolean, Pipeline, Document<unknown, {}, Pipeline, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Pipeline & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, Pipeline>;
