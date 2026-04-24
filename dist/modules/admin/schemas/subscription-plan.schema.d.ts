import { HydratedDocument } from 'mongoose';
export type SubscriptionPlanDocument = HydratedDocument<SubscriptionPlan>;
export declare class SubscriptionPlan {
    key: string;
    name: string;
    description?: string;
    /** Price in minor units (e.g. dram cents or whole AMD depending on product convention). */
    priceMinor: number;
    currencyCode: 'AMD' | 'USD' | 'EUR';
    billingPeriod: 'month' | 'year';
    featureIds: string[];
    sortOrder: number;
    isActive: boolean;
    /** Short label shown on cards, e.g. "Popular". */
    highlightTag?: string;
}
export declare const SubscriptionPlanSchema: import("mongoose").Schema<SubscriptionPlan, import("mongoose").Model<SubscriptionPlan, any, any, any, any, any, SubscriptionPlan>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, SubscriptionPlan, import("mongoose").Document<unknown, {}, SubscriptionPlan, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<SubscriptionPlan & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    key?: import("mongoose").SchemaDefinitionProperty<string, SubscriptionPlan, import("mongoose").Document<unknown, {}, SubscriptionPlan, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<SubscriptionPlan & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    name?: import("mongoose").SchemaDefinitionProperty<string, SubscriptionPlan, import("mongoose").Document<unknown, {}, SubscriptionPlan, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<SubscriptionPlan & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    description?: import("mongoose").SchemaDefinitionProperty<string | undefined, SubscriptionPlan, import("mongoose").Document<unknown, {}, SubscriptionPlan, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<SubscriptionPlan & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    priceMinor?: import("mongoose").SchemaDefinitionProperty<number, SubscriptionPlan, import("mongoose").Document<unknown, {}, SubscriptionPlan, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<SubscriptionPlan & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    currencyCode?: import("mongoose").SchemaDefinitionProperty<"AMD" | "USD" | "EUR", SubscriptionPlan, import("mongoose").Document<unknown, {}, SubscriptionPlan, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<SubscriptionPlan & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    billingPeriod?: import("mongoose").SchemaDefinitionProperty<"month" | "year", SubscriptionPlan, import("mongoose").Document<unknown, {}, SubscriptionPlan, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<SubscriptionPlan & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    featureIds?: import("mongoose").SchemaDefinitionProperty<string[], SubscriptionPlan, import("mongoose").Document<unknown, {}, SubscriptionPlan, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<SubscriptionPlan & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    sortOrder?: import("mongoose").SchemaDefinitionProperty<number, SubscriptionPlan, import("mongoose").Document<unknown, {}, SubscriptionPlan, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<SubscriptionPlan & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    isActive?: import("mongoose").SchemaDefinitionProperty<boolean, SubscriptionPlan, import("mongoose").Document<unknown, {}, SubscriptionPlan, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<SubscriptionPlan & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    highlightTag?: import("mongoose").SchemaDefinitionProperty<string | undefined, SubscriptionPlan, import("mongoose").Document<unknown, {}, SubscriptionPlan, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<SubscriptionPlan & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, SubscriptionPlan>;
