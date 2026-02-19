import { Document } from 'mongoose';
export type PermissionDocument = Permission & Document;
export declare class Permission {
    name: string;
    description: string;
    module: string;
}
export declare const PermissionSchema: import("mongoose").Schema<Permission, import("mongoose").Model<Permission, any, any, any, (Document<unknown, any, Permission, any, import("mongoose").DefaultSchemaOptions> & Permission & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
} & {
    id: string;
}) | (Document<unknown, any, Permission, any, import("mongoose").DefaultSchemaOptions> & Permission & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}), any, Permission>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Permission, Document<unknown, {}, Permission, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Permission & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    name?: import("mongoose").SchemaDefinitionProperty<string, Permission, Document<unknown, {}, Permission, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Permission & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    description?: import("mongoose").SchemaDefinitionProperty<string, Permission, Document<unknown, {}, Permission, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Permission & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    module?: import("mongoose").SchemaDefinitionProperty<string, Permission, Document<unknown, {}, Permission, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Permission & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, Permission>;
