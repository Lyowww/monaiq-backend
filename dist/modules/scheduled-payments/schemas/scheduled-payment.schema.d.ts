import { HydratedDocument, Types } from 'mongoose';
export type ScheduledPaymentDocument = HydratedDocument<ScheduledPayment>;
export declare class ScheduledPayment {
    userId: Types.ObjectId;
    title: string;
    description?: string;
    amountMinor: number;
    dueDate: Date;
    recurring: boolean;
    recurrenceType: 'none' | 'weekly' | 'monthly';
    category: 'utilities' | 'subscription' | 'rent' | 'other';
    status: 'pending' | 'paid';
    reminderEnabled: boolean;
}
export declare const ScheduledPaymentSchema: import("mongoose").Schema<ScheduledPayment, import("mongoose").Model<ScheduledPayment, any, any, any, any, any, ScheduledPayment>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, ScheduledPayment, import("mongoose").Document<unknown, {}, ScheduledPayment, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<ScheduledPayment & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    userId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, ScheduledPayment, import("mongoose").Document<unknown, {}, ScheduledPayment, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ScheduledPayment & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    title?: import("mongoose").SchemaDefinitionProperty<string, ScheduledPayment, import("mongoose").Document<unknown, {}, ScheduledPayment, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ScheduledPayment & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    description?: import("mongoose").SchemaDefinitionProperty<string | undefined, ScheduledPayment, import("mongoose").Document<unknown, {}, ScheduledPayment, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ScheduledPayment & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    amountMinor?: import("mongoose").SchemaDefinitionProperty<number, ScheduledPayment, import("mongoose").Document<unknown, {}, ScheduledPayment, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ScheduledPayment & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    dueDate?: import("mongoose").SchemaDefinitionProperty<Date, ScheduledPayment, import("mongoose").Document<unknown, {}, ScheduledPayment, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ScheduledPayment & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    recurring?: import("mongoose").SchemaDefinitionProperty<boolean, ScheduledPayment, import("mongoose").Document<unknown, {}, ScheduledPayment, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ScheduledPayment & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    recurrenceType?: import("mongoose").SchemaDefinitionProperty<"none" | "weekly" | "monthly", ScheduledPayment, import("mongoose").Document<unknown, {}, ScheduledPayment, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ScheduledPayment & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    category?: import("mongoose").SchemaDefinitionProperty<"subscription" | "other" | "utilities" | "rent", ScheduledPayment, import("mongoose").Document<unknown, {}, ScheduledPayment, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ScheduledPayment & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    status?: import("mongoose").SchemaDefinitionProperty<"pending" | "paid", ScheduledPayment, import("mongoose").Document<unknown, {}, ScheduledPayment, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ScheduledPayment & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    reminderEnabled?: import("mongoose").SchemaDefinitionProperty<boolean, ScheduledPayment, import("mongoose").Document<unknown, {}, ScheduledPayment, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ScheduledPayment & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, ScheduledPayment>;
