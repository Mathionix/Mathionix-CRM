import { Document } from 'mongoose';
export type KnowledgeCategoryDocument = KnowledgeCategory & Document;
export declare class KnowledgeCategory {
    name: string;
    description: string;
    icon: string;
    order: number;
}
export declare const KnowledgeCategorySchema: import("mongoose").Schema<KnowledgeCategory, import("mongoose").Model<KnowledgeCategory, any, any, any, (Document<unknown, any, KnowledgeCategory, any, import("mongoose").DefaultSchemaOptions> & KnowledgeCategory & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
} & {
    id: string;
}) | (Document<unknown, any, KnowledgeCategory, any, import("mongoose").DefaultSchemaOptions> & KnowledgeCategory & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}), any, KnowledgeCategory>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, KnowledgeCategory, Document<unknown, {}, KnowledgeCategory, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<KnowledgeCategory & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    name?: import("mongoose").SchemaDefinitionProperty<string, KnowledgeCategory, Document<unknown, {}, KnowledgeCategory, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<KnowledgeCategory & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    description?: import("mongoose").SchemaDefinitionProperty<string, KnowledgeCategory, Document<unknown, {}, KnowledgeCategory, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<KnowledgeCategory & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    icon?: import("mongoose").SchemaDefinitionProperty<string, KnowledgeCategory, Document<unknown, {}, KnowledgeCategory, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<KnowledgeCategory & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    order?: import("mongoose").SchemaDefinitionProperty<number, KnowledgeCategory, Document<unknown, {}, KnowledgeCategory, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<KnowledgeCategory & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, KnowledgeCategory>;
