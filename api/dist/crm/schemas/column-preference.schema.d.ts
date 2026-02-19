import { Document, Types } from 'mongoose';
export type ColumnPreferenceDocument = ColumnPreference & Document;
export declare class ColumnPreference {
    user: Types.ObjectId;
    module: string;
    columns: string[];
}
export declare const ColumnPreferenceSchema: import("mongoose").Schema<ColumnPreference, import("mongoose").Model<ColumnPreference, any, any, any, (Document<unknown, any, ColumnPreference, any, import("mongoose").DefaultSchemaOptions> & ColumnPreference & {
    _id: Types.ObjectId;
} & {
    __v: number;
} & {
    id: string;
}) | (Document<unknown, any, ColumnPreference, any, import("mongoose").DefaultSchemaOptions> & ColumnPreference & {
    _id: Types.ObjectId;
} & {
    __v: number;
}), any, ColumnPreference>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, ColumnPreference, Document<unknown, {}, ColumnPreference, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<ColumnPreference & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    user?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, ColumnPreference, Document<unknown, {}, ColumnPreference, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ColumnPreference & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    module?: import("mongoose").SchemaDefinitionProperty<string, ColumnPreference, Document<unknown, {}, ColumnPreference, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ColumnPreference & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    columns?: import("mongoose").SchemaDefinitionProperty<string[], ColumnPreference, Document<unknown, {}, ColumnPreference, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ColumnPreference & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, ColumnPreference>;
