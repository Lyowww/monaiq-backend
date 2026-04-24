import { HydratedDocument, Types } from 'mongoose';
export type FinancialPlanDocument = HydratedDocument<FinancialPlan>;
export declare class FinancialPlan {
    userId: Types.ObjectId;
    title: string;
    planType: 'monthly_spend_cap' | 'category_spend_cap' | 'savings_target';
    capMinor?: number;
    category?: string;
    targetMinor?: number;
    savedMinor: number;
    notes?: string;
    status: 'active' | 'archived';
}
export declare const FinancialPlanSchema: import("mongoose").Schema<FinancialPlan, import("mongoose").Model<FinancialPlan, any, any, any, any, any, FinancialPlan>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, FinancialPlan, import("mongoose").Document<unknown, {}, FinancialPlan, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<FinancialPlan & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    userId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, FinancialPlan, import("mongoose").Document<unknown, {}, FinancialPlan, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<FinancialPlan & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    title?: import("mongoose").SchemaDefinitionProperty<string, FinancialPlan, import("mongoose").Document<unknown, {}, FinancialPlan, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<FinancialPlan & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    planType?: import("mongoose").SchemaDefinitionProperty<"monthly_spend_cap" | "category_spend_cap" | "savings_target", FinancialPlan, import("mongoose").Document<unknown, {}, FinancialPlan, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<FinancialPlan & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    capMinor?: import("mongoose").SchemaDefinitionProperty<number | undefined, FinancialPlan, import("mongoose").Document<unknown, {}, FinancialPlan, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<FinancialPlan & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    category?: import("mongoose").SchemaDefinitionProperty<string | undefined, FinancialPlan, import("mongoose").Document<unknown, {}, FinancialPlan, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<FinancialPlan & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    targetMinor?: import("mongoose").SchemaDefinitionProperty<number | undefined, FinancialPlan, import("mongoose").Document<unknown, {}, FinancialPlan, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<FinancialPlan & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    savedMinor?: import("mongoose").SchemaDefinitionProperty<number, FinancialPlan, import("mongoose").Document<unknown, {}, FinancialPlan, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<FinancialPlan & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    notes?: import("mongoose").SchemaDefinitionProperty<string | undefined, FinancialPlan, import("mongoose").Document<unknown, {}, FinancialPlan, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<FinancialPlan & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    status?: import("mongoose").SchemaDefinitionProperty<"active" | "archived", FinancialPlan, import("mongoose").Document<unknown, {}, FinancialPlan, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<FinancialPlan & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, FinancialPlan>;
