import { Document, Types } from 'mongoose';
export type UserConfigDocument = UserConfig & Document;
export declare class UserConfig {
    userId: Types.ObjectId;
    dashboardLayout: any[];
    savedReports: any[];
    reportLayout: any[];
}
export declare const UserConfigSchema: import("mongoose").Schema<UserConfig, import("mongoose").Model<UserConfig, any, any, any, (Document<unknown, any, UserConfig, any, import("mongoose").DefaultSchemaOptions> & UserConfig & {
    _id: Types.ObjectId;
} & {
    __v: number;
} & {
    id: string;
}) | (Document<unknown, any, UserConfig, any, import("mongoose").DefaultSchemaOptions> & UserConfig & {
    _id: Types.ObjectId;
} & {
    __v: number;
}), any, UserConfig>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, UserConfig, Document<unknown, {}, UserConfig, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<UserConfig & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    userId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, UserConfig, Document<unknown, {}, UserConfig, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<UserConfig & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    dashboardLayout?: import("mongoose").SchemaDefinitionProperty<any[], UserConfig, Document<unknown, {}, UserConfig, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<UserConfig & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    savedReports?: import("mongoose").SchemaDefinitionProperty<any[], UserConfig, Document<unknown, {}, UserConfig, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<UserConfig & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    reportLayout?: import("mongoose").SchemaDefinitionProperty<any[], UserConfig, Document<unknown, {}, UserConfig, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<UserConfig & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, UserConfig>;
