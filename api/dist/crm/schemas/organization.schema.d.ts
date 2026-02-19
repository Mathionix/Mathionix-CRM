import { Document } from 'mongoose';
export type OrganizationDocument = Organization & Document;
export declare class Organization {
    name: string;
    website: string;
    territory: string;
    industry: string;
    noOfEmployees: string;
    annualRevenue: number;
    phone: string;
    email: string;
    address: string;
    customFields: Map<string, string>;
}
export declare const OrganizationSchema: import("mongoose").Schema<Organization, import("mongoose").Model<Organization, any, any, any, (Document<unknown, any, Organization, any, import("mongoose").DefaultSchemaOptions> & Organization & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
} & {
    id: string;
}) | (Document<unknown, any, Organization, any, import("mongoose").DefaultSchemaOptions> & Organization & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}), any, Organization>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Organization, Document<unknown, {}, Organization, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Organization & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    name?: import("mongoose").SchemaDefinitionProperty<string, Organization, Document<unknown, {}, Organization, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Organization & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    website?: import("mongoose").SchemaDefinitionProperty<string, Organization, Document<unknown, {}, Organization, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Organization & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    territory?: import("mongoose").SchemaDefinitionProperty<string, Organization, Document<unknown, {}, Organization, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Organization & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    industry?: import("mongoose").SchemaDefinitionProperty<string, Organization, Document<unknown, {}, Organization, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Organization & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    noOfEmployees?: import("mongoose").SchemaDefinitionProperty<string, Organization, Document<unknown, {}, Organization, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Organization & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    annualRevenue?: import("mongoose").SchemaDefinitionProperty<number, Organization, Document<unknown, {}, Organization, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Organization & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    phone?: import("mongoose").SchemaDefinitionProperty<string, Organization, Document<unknown, {}, Organization, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Organization & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    email?: import("mongoose").SchemaDefinitionProperty<string, Organization, Document<unknown, {}, Organization, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Organization & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    address?: import("mongoose").SchemaDefinitionProperty<string, Organization, Document<unknown, {}, Organization, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Organization & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    customFields?: import("mongoose").SchemaDefinitionProperty<Map<string, string>, Organization, Document<unknown, {}, Organization, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Organization & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, Organization>;
