import { HydratedDocument, Types } from 'mongoose';
export type AiChatLogDocument = HydratedDocument<AiChatLog>;
export declare class AiChatLog {
    userId: Types.ObjectId;
    messagePreview: string;
    charCount: number;
}
export declare const AiChatLogSchema: import("mongoose").Schema<AiChatLog, import("mongoose").Model<AiChatLog, any, any, any, any, any, AiChatLog>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, AiChatLog, import("mongoose").Document<unknown, {}, AiChatLog, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<AiChatLog & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    userId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, AiChatLog, import("mongoose").Document<unknown, {}, AiChatLog, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<AiChatLog & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    messagePreview?: import("mongoose").SchemaDefinitionProperty<string, AiChatLog, import("mongoose").Document<unknown, {}, AiChatLog, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<AiChatLog & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    charCount?: import("mongoose").SchemaDefinitionProperty<number, AiChatLog, import("mongoose").Document<unknown, {}, AiChatLog, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<AiChatLog & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, AiChatLog>;
