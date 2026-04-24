import { HydratedDocument, Types } from 'mongoose';
export type AiFinanceConversationDocument = HydratedDocument<AiFinanceConversation>;
export declare class FinanceChatTurn {
    role: 'user' | 'assistant';
    content: string;
    at: Date;
}
export declare class AiFinanceConversation {
    userId: Types.ObjectId;
    title: string;
    messages: FinanceChatTurn[];
}
export declare const AiFinanceConversationSchema: import("mongoose").Schema<AiFinanceConversation, import("mongoose").Model<AiFinanceConversation, any, any, any, any, any, AiFinanceConversation>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, AiFinanceConversation, import("mongoose").Document<unknown, {}, AiFinanceConversation, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<AiFinanceConversation & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    userId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, AiFinanceConversation, import("mongoose").Document<unknown, {}, AiFinanceConversation, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<AiFinanceConversation & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    title?: import("mongoose").SchemaDefinitionProperty<string, AiFinanceConversation, import("mongoose").Document<unknown, {}, AiFinanceConversation, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<AiFinanceConversation & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    messages?: import("mongoose").SchemaDefinitionProperty<FinanceChatTurn[], AiFinanceConversation, import("mongoose").Document<unknown, {}, AiFinanceConversation, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<AiFinanceConversation & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, AiFinanceConversation>;
