import { Document, Types } from 'mongoose';
export type LeadDocument = Lead & Document;
export declare class Lead {
    firstName: string;
    middleName: string;
    lastName: string;
    status: string;
    email: string;
    mobileNo: string;
    phone: string;
    organization: string;
    jobTitle: string;
    source: string;
    industry: string;
    annualRevenue: number;
    noOfEmployees: string;
    leadOwner: string;
    converted: boolean;
    website: string;
    territory: string;
    image: string;
    customFields: Map<string, string>;
    createdBy: Types.ObjectId;
}
export declare const LeadSchema: import("mongoose").Schema<Lead, import("mongoose").Model<Lead, any, any, any, (Document<unknown, any, Lead, any, import("mongoose").DefaultSchemaOptions> & Lead & {
    _id: Types.ObjectId;
} & {
    __v: number;
} & {
    id: string;
}) | (Document<unknown, any, Lead, any, import("mongoose").DefaultSchemaOptions> & Lead & {
    _id: Types.ObjectId;
} & {
    __v: number;
}), any, Lead>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Lead, Document<unknown, {}, Lead, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Lead & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    firstName?: import("mongoose").SchemaDefinitionProperty<string, Lead, Document<unknown, {}, Lead, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Lead & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    middleName?: import("mongoose").SchemaDefinitionProperty<string, Lead, Document<unknown, {}, Lead, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Lead & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    lastName?: import("mongoose").SchemaDefinitionProperty<string, Lead, Document<unknown, {}, Lead, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Lead & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    status?: import("mongoose").SchemaDefinitionProperty<string, Lead, Document<unknown, {}, Lead, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Lead & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    email?: import("mongoose").SchemaDefinitionProperty<string, Lead, Document<unknown, {}, Lead, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Lead & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    mobileNo?: import("mongoose").SchemaDefinitionProperty<string, Lead, Document<unknown, {}, Lead, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Lead & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    phone?: import("mongoose").SchemaDefinitionProperty<string, Lead, Document<unknown, {}, Lead, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Lead & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    organization?: import("mongoose").SchemaDefinitionProperty<string, Lead, Document<unknown, {}, Lead, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Lead & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    jobTitle?: import("mongoose").SchemaDefinitionProperty<string, Lead, Document<unknown, {}, Lead, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Lead & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    source?: import("mongoose").SchemaDefinitionProperty<string, Lead, Document<unknown, {}, Lead, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Lead & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    industry?: import("mongoose").SchemaDefinitionProperty<string, Lead, Document<unknown, {}, Lead, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Lead & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    annualRevenue?: import("mongoose").SchemaDefinitionProperty<number, Lead, Document<unknown, {}, Lead, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Lead & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    noOfEmployees?: import("mongoose").SchemaDefinitionProperty<string, Lead, Document<unknown, {}, Lead, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Lead & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    leadOwner?: import("mongoose").SchemaDefinitionProperty<string, Lead, Document<unknown, {}, Lead, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Lead & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    converted?: import("mongoose").SchemaDefinitionProperty<boolean, Lead, Document<unknown, {}, Lead, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Lead & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    website?: import("mongoose").SchemaDefinitionProperty<string, Lead, Document<unknown, {}, Lead, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Lead & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    territory?: import("mongoose").SchemaDefinitionProperty<string, Lead, Document<unknown, {}, Lead, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Lead & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    image?: import("mongoose").SchemaDefinitionProperty<string, Lead, Document<unknown, {}, Lead, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Lead & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    customFields?: import("mongoose").SchemaDefinitionProperty<Map<string, string>, Lead, Document<unknown, {}, Lead, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Lead & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    createdBy?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, Lead, Document<unknown, {}, Lead, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Lead & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, Lead>;
