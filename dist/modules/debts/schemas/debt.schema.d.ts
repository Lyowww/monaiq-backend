import { HydratedDocument, Types } from 'mongoose';
export type DebtDocument = HydratedDocument<Debt>;
export declare class Debt {
    userId: Types.ObjectId;
    lenderName: string;
    personName?: string;
    debtType: 'I_OWE' | 'THEY_OWE';
    reason?: string;
    reminderEnabled: boolean;
    principalMinor: number;
    outstandingMinor: number;
    minimumDueMinor: number;
    aprPercent: number;
    dueDate: Date;
    relationship: 'family' | 'friend' | 'bank' | 'fintech' | 'other';
    status: 'active' | 'settled' | 'defaulted';
}
export declare const DebtSchema: import("mongoose").Schema<Debt, import("mongoose").Model<Debt, any, any, any, any, any, Debt>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Debt, import("mongoose").Document<unknown, {}, Debt, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Debt & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    userId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, Debt, import("mongoose").Document<unknown, {}, Debt, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Debt & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    lenderName?: import("mongoose").SchemaDefinitionProperty<string, Debt, import("mongoose").Document<unknown, {}, Debt, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Debt & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    personName?: import("mongoose").SchemaDefinitionProperty<string | undefined, Debt, import("mongoose").Document<unknown, {}, Debt, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Debt & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    debtType?: import("mongoose").SchemaDefinitionProperty<"I_OWE" | "THEY_OWE", Debt, import("mongoose").Document<unknown, {}, Debt, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Debt & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    reason?: import("mongoose").SchemaDefinitionProperty<string | undefined, Debt, import("mongoose").Document<unknown, {}, Debt, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Debt & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    reminderEnabled?: import("mongoose").SchemaDefinitionProperty<boolean, Debt, import("mongoose").Document<unknown, {}, Debt, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Debt & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    principalMinor?: import("mongoose").SchemaDefinitionProperty<number, Debt, import("mongoose").Document<unknown, {}, Debt, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Debt & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    outstandingMinor?: import("mongoose").SchemaDefinitionProperty<number, Debt, import("mongoose").Document<unknown, {}, Debt, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Debt & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    minimumDueMinor?: import("mongoose").SchemaDefinitionProperty<number, Debt, import("mongoose").Document<unknown, {}, Debt, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Debt & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    aprPercent?: import("mongoose").SchemaDefinitionProperty<number, Debt, import("mongoose").Document<unknown, {}, Debt, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Debt & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    dueDate?: import("mongoose").SchemaDefinitionProperty<Date, Debt, import("mongoose").Document<unknown, {}, Debt, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Debt & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    relationship?: import("mongoose").SchemaDefinitionProperty<"family" | "friend" | "bank" | "fintech" | "other", Debt, import("mongoose").Document<unknown, {}, Debt, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Debt & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    status?: import("mongoose").SchemaDefinitionProperty<"active" | "settled" | "defaulted", Debt, import("mongoose").Document<unknown, {}, Debt, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Debt & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, Debt>;
