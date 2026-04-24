import { HydratedDocument, Types } from 'mongoose';
export type SavingsGoalDocument = HydratedDocument<SavingsGoal>;
export declare class SavingsGoal {
    userId: Types.ObjectId;
    title: string;
    targetMinor: number;
    currencyCode: 'AMD';
    targetAt?: Date;
    savedMinor: number;
    /** AI “safe to save” nudge, minor units, optional */
    safeToSaveMinor?: number;
    lastCoachAdviceAt?: Date;
    status: 'active' | 'completed' | 'archived';
}
export declare const SavingsGoalSchema: import("mongoose").Schema<SavingsGoal, import("mongoose").Model<SavingsGoal, any, any, any, any, any, SavingsGoal>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, SavingsGoal, import("mongoose").Document<unknown, {}, SavingsGoal, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<SavingsGoal & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    userId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, SavingsGoal, import("mongoose").Document<unknown, {}, SavingsGoal, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<SavingsGoal & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    title?: import("mongoose").SchemaDefinitionProperty<string, SavingsGoal, import("mongoose").Document<unknown, {}, SavingsGoal, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<SavingsGoal & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    targetMinor?: import("mongoose").SchemaDefinitionProperty<number, SavingsGoal, import("mongoose").Document<unknown, {}, SavingsGoal, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<SavingsGoal & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    currencyCode?: import("mongoose").SchemaDefinitionProperty<"AMD", SavingsGoal, import("mongoose").Document<unknown, {}, SavingsGoal, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<SavingsGoal & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    targetAt?: import("mongoose").SchemaDefinitionProperty<Date | undefined, SavingsGoal, import("mongoose").Document<unknown, {}, SavingsGoal, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<SavingsGoal & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    savedMinor?: import("mongoose").SchemaDefinitionProperty<number, SavingsGoal, import("mongoose").Document<unknown, {}, SavingsGoal, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<SavingsGoal & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    safeToSaveMinor?: import("mongoose").SchemaDefinitionProperty<number | undefined, SavingsGoal, import("mongoose").Document<unknown, {}, SavingsGoal, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<SavingsGoal & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    lastCoachAdviceAt?: import("mongoose").SchemaDefinitionProperty<Date | undefined, SavingsGoal, import("mongoose").Document<unknown, {}, SavingsGoal, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<SavingsGoal & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    status?: import("mongoose").SchemaDefinitionProperty<"active" | "archived" | "completed", SavingsGoal, import("mongoose").Document<unknown, {}, SavingsGoal, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<SavingsGoal & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, SavingsGoal>;
