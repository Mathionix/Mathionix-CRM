import { Document } from 'mongoose';
export type CustomFieldDocument = CustomField & Document;
export declare enum CustomFieldType {
    TEXT = "text",
    NUMBER = "number",
    DATE = "date",
    SELECT = "select",
    CHECKBOX = "checkbox"
}
export declare class CustomField {
    name: string;
    key: string;
    type: CustomFieldType;
    module: string;
    options: string[];
    required: boolean;
    description: string;
    isActive: boolean;
}
export declare const CustomFieldSchema: import("mongoose").Schema<CustomField, import("mongoose").Model<CustomField, any, any, any, (Document<unknown, any, CustomField, any, import("mongoose").DefaultSchemaOptions> & CustomField & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
} & {
    id: string;
}) | (Document<unknown, any, CustomField, any, import("mongoose").DefaultSchemaOptions> & CustomField & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}), any, CustomField>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, CustomField, Document<unknown, {}, CustomField, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<CustomField & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    name?: import("mongoose").SchemaDefinitionProperty<string, CustomField, Document<unknown, {}, CustomField, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<CustomField & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    key?: import("mongoose").SchemaDefinitionProperty<string, CustomField, Document<unknown, {}, CustomField, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<CustomField & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    type?: import("mongoose").SchemaDefinitionProperty<CustomFieldType, CustomField, Document<unknown, {}, CustomField, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<CustomField & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    module?: import("mongoose").SchemaDefinitionProperty<string, CustomField, Document<unknown, {}, CustomField, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<CustomField & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    options?: import("mongoose").SchemaDefinitionProperty<string[], CustomField, Document<unknown, {}, CustomField, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<CustomField & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    required?: import("mongoose").SchemaDefinitionProperty<boolean, CustomField, Document<unknown, {}, CustomField, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<CustomField & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    description?: import("mongoose").SchemaDefinitionProperty<string, CustomField, Document<unknown, {}, CustomField, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<CustomField & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    isActive?: import("mongoose").SchemaDefinitionProperty<boolean, CustomField, Document<unknown, {}, CustomField, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<CustomField & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, CustomField>;
