import { Document, Types } from 'mongoose';
export type ActivityDocument = Activity & Document;
export declare class Activity {
    type: string;
    content: string;
    relatedTo: Types.ObjectId;
    relatedType: string;
    author: Types.ObjectId;
    metadata: any;
}
export declare const ActivitySchema: import("mongoose").Schema<Activity, import("mongoose").Model<Activity, any, any, any, (Document<unknown, any, Activity, any, import("mongoose").DefaultSchemaOptions> & Activity & {
    _id: Types.ObjectId;
} & {
    __v: number;
} & {
    id: string;
}) | (Document<unknown, any, Activity, any, import("mongoose").DefaultSchemaOptions> & Activity & {
    _id: Types.ObjectId;
} & {
    __v: number;
}), any, Activity>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Activity, Document<unknown, {}, Activity, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Activity & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    type?: import("mongoose").SchemaDefinitionProperty<string, Activity, Document<unknown, {}, Activity, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Activity & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    content?: import("mongoose").SchemaDefinitionProperty<string, Activity, Document<unknown, {}, Activity, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Activity & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    relatedTo?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, Activity, Document<unknown, {}, Activity, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Activity & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    relatedType?: import("mongoose").SchemaDefinitionProperty<string, Activity, Document<unknown, {}, Activity, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Activity & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    author?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, Activity, Document<unknown, {}, Activity, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Activity & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    metadata?: import("mongoose").SchemaDefinitionProperty<any, Activity, Document<unknown, {}, Activity, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Activity & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, Activity>;
