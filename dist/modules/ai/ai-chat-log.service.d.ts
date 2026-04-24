import { Model } from 'mongoose';
import { type AiChatLogDocument } from './ai-chat-log.schema';
export declare class AiChatLogService {
    private readonly model;
    constructor(model: Model<AiChatLogDocument>);
    logUserMessage(userId: string, message: string): Promise<void>;
}
