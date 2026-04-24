import { HydratedDocument, Types } from 'mongoose';
export type ObligationDocument = HydratedDocument<Obligation>;
export type ObligationKind = 'loan' | 'utility' | 'subscription';
export declare class Obligation {
    userId: Types.ObjectId;
    kind: ObligationKind;
    /** Shown in UI; can be entered in English or Eastern Armenian. */
    title: string;
    amountDueMinor: number;
    currencyCode: 'AMD';
    nextDueAt: Date;
    cadence: 'one_time' | 'monthly' | 'quarterly' | 'yearly';
    utilityType?: 'gas' | 'water' | 'electricity' | 'sewer' | 'trash' | 'other';
    serviceProviderName?: string;
    accountReference?: string;
    pushReminderEnabled: boolean;
    fcmTokenSnapshot?: string;
    status: 'active' | 'snoozed' | 'closed';
    labelLocale: 'en' | 'hy';
}
export declare const ObligationSchema: import("mongoose").Schema<Obligation, import("mongoose").Model<Obligation, any, any, any, any, any, Obligation>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Obligation, import("mongoose").Document<unknown, {}, Obligation, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Obligation & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    userId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, Obligation, import("mongoose").Document<unknown, {}, Obligation, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Obligation & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    kind?: import("mongoose").SchemaDefinitionProperty<ObligationKind, Obligation, import("mongoose").Document<unknown, {}, Obligation, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Obligation & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    title?: import("mongoose").SchemaDefinitionProperty<string, Obligation, import("mongoose").Document<unknown, {}, Obligation, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Obligation & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    amountDueMinor?: import("mongoose").SchemaDefinitionProperty<number, Obligation, import("mongoose").Document<unknown, {}, Obligation, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Obligation & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    currencyCode?: import("mongoose").SchemaDefinitionProperty<"AMD", Obligation, import("mongoose").Document<unknown, {}, Obligation, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Obligation & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    nextDueAt?: import("mongoose").SchemaDefinitionProperty<Date, Obligation, import("mongoose").Document<unknown, {}, Obligation, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Obligation & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    cadence?: import("mongoose").SchemaDefinitionProperty<"monthly" | "one_time" | "quarterly" | "yearly", Obligation, import("mongoose").Document<unknown, {}, Obligation, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Obligation & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    utilityType?: import("mongoose").SchemaDefinitionProperty<"other" | "gas" | "water" | "electricity" | "sewer" | "trash" | undefined, Obligation, import("mongoose").Document<unknown, {}, Obligation, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Obligation & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    serviceProviderName?: import("mongoose").SchemaDefinitionProperty<string | undefined, Obligation, import("mongoose").Document<unknown, {}, Obligation, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Obligation & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    accountReference?: import("mongoose").SchemaDefinitionProperty<string | undefined, Obligation, import("mongoose").Document<unknown, {}, Obligation, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Obligation & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    pushReminderEnabled?: import("mongoose").SchemaDefinitionProperty<boolean, Obligation, import("mongoose").Document<unknown, {}, Obligation, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Obligation & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    fcmTokenSnapshot?: import("mongoose").SchemaDefinitionProperty<string | undefined, Obligation, import("mongoose").Document<unknown, {}, Obligation, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Obligation & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    status?: import("mongoose").SchemaDefinitionProperty<"active" | "snoozed" | "closed", Obligation, import("mongoose").Document<unknown, {}, Obligation, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Obligation & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    labelLocale?: import("mongoose").SchemaDefinitionProperty<"en" | "hy", Obligation, import("mongoose").Document<unknown, {}, Obligation, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Obligation & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, Obligation>;
