import { Model, Types } from 'mongoose';
import { type AiFinanceConversationDocument } from './ai-finance-conversation.schema';
export type FinanceChatTurnDto = {
    role: 'user' | 'assistant';
    content: string;
    at: string;
};
export declare class AiFinanceConversationService {
    private readonly model;
    constructor(model: Model<AiFinanceConversationDocument>);
    previewTitle(message: string): string;
    create(userId: string, title: string): Promise<AiFinanceConversationDocument>;
    requireForUser(userId: string, conversationId: string): Promise<AiFinanceConversationDocument>;
    listSummaries(userId: string, limit?: number): Promise<{
        id: string;
        title: string;
        updatedAt: string;
    }[]>;
    getWithTurns(userId: string, conversationId: string): Promise<{
        id: string;
        title: string;
        updatedAt: string;
        messages: FinanceChatTurnDto[];
    }>;
    appendUserAssistantPair(conversationId: Types.ObjectId, userContent: string, assistantContent: string): Promise<void>;
}
