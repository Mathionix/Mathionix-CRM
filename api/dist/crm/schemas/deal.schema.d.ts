import { Document, Types } from 'mongoose';
export type DealDocument = Deal & Document;
export declare class Deal {
    organization: string;
    title: string;
    probability: number;
    pipeline: Types.ObjectId;
    stage: string;
    dealValue: number;
    expectedDealValue: number;
    dealOwner: string;
    contactPerson: string;
    lead: Types.ObjectId;
    expectedClosureDate: Date;
    closedDate: Date;
    nextStep: string;
    currency: string;
    exchangeRate: number;
    customFields: Map<string, string>;
    createdBy: Types.ObjectId;
    portalToken: string;
}
export declare const DealSchema: import("mongoose").Schema<Deal, import("mongoose").Model<Deal, any, any, any, (Document<unknown, any, Deal, any, import("mongoose").DefaultSchemaOptions> & Deal & {
    _id: Types.ObjectId;
} & {
    __v: number;
} & {
    id: string;
}) | (Document<unknown, any, Deal, any, import("mongoose").DefaultSchemaOptions> & Deal & {
    _id: Types.ObjectId;
} & {
    __v: number;
}), any, Deal>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Deal, Document<unknown, {}, Deal, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Deal & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    organization?: import("mongoose").SchemaDefinitionProperty<string, Deal, Document<unknown, {}, Deal, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Deal & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    title?: import("mongoose").SchemaDefinitionProperty<string, Deal, Document<unknown, {}, Deal, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Deal & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    probability?: import("mongoose").SchemaDefinitionProperty<number, Deal, Document<unknown, {}, Deal, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Deal & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    pipeline?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, Deal, Document<unknown, {}, Deal, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Deal & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    stage?: import("mongoose").SchemaDefinitionProperty<string, Deal, Document<unknown, {}, Deal, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Deal & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    dealValue?: import("mongoose").SchemaDefinitionProperty<number, Deal, Document<unknown, {}, Deal, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Deal & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    expectedDealValue?: import("mongoose").SchemaDefinitionProperty<number, Deal, Document<unknown, {}, Deal, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Deal & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    dealOwner?: import("mongoose").SchemaDefinitionProperty<string, Deal, Document<unknown, {}, Deal, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Deal & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    contactPerson?: import("mongoose").SchemaDefinitionProperty<string, Deal, Document<unknown, {}, Deal, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Deal & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    lead?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, Deal, Document<unknown, {}, Deal, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Deal & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    expectedClosureDate?: import("mongoose").SchemaDefinitionProperty<Date, Deal, Document<unknown, {}, Deal, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Deal & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    closedDate?: import("mongoose").SchemaDefinitionProperty<Date, Deal, Document<unknown, {}, Deal, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Deal & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    nextStep?: import("mongoose").SchemaDefinitionProperty<string, Deal, Document<unknown, {}, Deal, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Deal & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    currency?: import("mongoose").SchemaDefinitionProperty<string, Deal, Document<unknown, {}, Deal, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Deal & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    exchangeRate?: import("mongoose").SchemaDefinitionProperty<number, Deal, Document<unknown, {}, Deal, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Deal & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    customFields?: import("mongoose").SchemaDefinitionProperty<Map<string, string>, Deal, Document<unknown, {}, Deal, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Deal & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    createdBy?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, Deal, Document<unknown, {}, Deal, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Deal & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    portalToken?: import("mongoose").SchemaDefinitionProperty<string, Deal, Document<unknown, {}, Deal, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Deal & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, Deal>;
