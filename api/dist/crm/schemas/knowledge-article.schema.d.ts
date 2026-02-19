import { Document, Types } from 'mongoose';
export type KnowledgeArticleDocument = KnowledgeArticle & Document;
export declare class KnowledgeArticle {
    title: string;
    content: string;
    category: Types.ObjectId;
    tags: string[];
    author: Types.ObjectId;
    status: string;
    viewCount: number;
}
export declare const KnowledgeArticleSchema: import("mongoose").Schema<KnowledgeArticle, import("mongoose").Model<KnowledgeArticle, any, any, any, (Document<unknown, any, KnowledgeArticle, any, import("mongoose").DefaultSchemaOptions> & KnowledgeArticle & {
    _id: Types.ObjectId;
} & {
    __v: number;
} & {
    id: string;
}) | (Document<unknown, any, KnowledgeArticle, any, import("mongoose").DefaultSchemaOptions> & KnowledgeArticle & {
    _id: Types.ObjectId;
} & {
    __v: number;
}), any, KnowledgeArticle>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, KnowledgeArticle, Document<unknown, {}, KnowledgeArticle, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<KnowledgeArticle & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    title?: import("mongoose").SchemaDefinitionProperty<string, KnowledgeArticle, Document<unknown, {}, KnowledgeArticle, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<KnowledgeArticle & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    content?: import("mongoose").SchemaDefinitionProperty<string, KnowledgeArticle, Document<unknown, {}, KnowledgeArticle, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<KnowledgeArticle & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    category?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, KnowledgeArticle, Document<unknown, {}, KnowledgeArticle, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<KnowledgeArticle & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    tags?: import("mongoose").SchemaDefinitionProperty<string[], KnowledgeArticle, Document<unknown, {}, KnowledgeArticle, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<KnowledgeArticle & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    author?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, KnowledgeArticle, Document<unknown, {}, KnowledgeArticle, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<KnowledgeArticle & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    status?: import("mongoose").SchemaDefinitionProperty<string, KnowledgeArticle, Document<unknown, {}, KnowledgeArticle, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<KnowledgeArticle & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    viewCount?: import("mongoose").SchemaDefinitionProperty<number, KnowledgeArticle, Document<unknown, {}, KnowledgeArticle, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<KnowledgeArticle & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, KnowledgeArticle>;
