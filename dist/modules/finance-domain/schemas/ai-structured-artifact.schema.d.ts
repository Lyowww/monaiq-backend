import { HydratedDocument, Types, Schema as MongooseSchema } from 'mongoose';
export type AiStructuredArtifactDocument = HydratedDocument<AiStructuredArtifact>;
export declare class AiStructuredArtifact {
    userId: Types.ObjectId;
    kind: 'income_nudge' | 'cash_runway' | 'savings_coach' | 'utility_benchmark' | 'debt_sms_draft' | 'general';
    schemaVersion: number;
    /** Strict JSON from the LLM; versioned with schemaVersion. */
    payload: Record<string, unknown>;
    idempotencyKey?: string;
}
export declare const AiStructuredArtifactSchema: MongooseSchema<AiStructuredArtifact, import("mongoose").Model<AiStructuredArtifact, any, any, any, any, any, AiStructuredArtifact>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, AiStructuredArtifact, import("mongoose").Document<unknown, {}, AiStructuredArtifact, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<AiStructuredArtifact & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    userId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, AiStructuredArtifact, import("mongoose").Document<unknown, {}, AiStructuredArtifact, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<AiStructuredArtifact & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    kind?: import("mongoose").SchemaDefinitionProperty<"general" | "income_nudge" | "cash_runway" | "savings_coach" | "utility_benchmark" | "debt_sms_draft", AiStructuredArtifact, import("mongoose").Document<unknown, {}, AiStructuredArtifact, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<AiStructuredArtifact & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    schemaVersion?: import("mongoose").SchemaDefinitionProperty<number, AiStructuredArtifact, import("mongoose").Document<unknown, {}, AiStructuredArtifact, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<AiStructuredArtifact & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    payload?: import("mongoose").SchemaDefinitionProperty<Record<string, unknown>, AiStructuredArtifact, import("mongoose").Document<unknown, {}, AiStructuredArtifact, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<AiStructuredArtifact & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    idempotencyKey?: import("mongoose").SchemaDefinitionProperty<string | undefined, AiStructuredArtifact, import("mongoose").Document<unknown, {}, AiStructuredArtifact, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<AiStructuredArtifact & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, AiStructuredArtifact>;
