import type { Response } from 'express';
import type { AccessTokenClaims } from '../auth/auth.types';
import { FinanceChatDto, OpenRouterChatDto, ReceiptOcrDto } from './ai.dto';
import { AiChatLogService } from './ai-chat-log.service';
import { AiFinanceConversationService } from './ai-finance-conversation.service';
import { FinanceAssistantService } from './finance-assistant.service';
import { OpenRouterLlmService } from './openrouter-llm.service';
import { OcrService } from './ocr.service';
import { SpeechService } from './speech.service';
import { TranslationService } from './translation.service';
export declare class AiController {
    private readonly ocrService;
    private readonly speechService;
    private readonly financeAssistant;
    private readonly aiChatLog;
    private readonly financeConversations;
    private readonly openRouter;
    private readonly translation;
    constructor(ocrService: OcrService, speechService: SpeechService, financeAssistant: FinanceAssistantService, aiChatLog: AiChatLogService, financeConversations: AiFinanceConversationService, openRouter: OpenRouterLlmService, translation: TranslationService);
    openRouterChatStream(_claims: AccessTokenClaims, res: Response, dto: OpenRouterChatDto): Promise<void>;
    listFinanceConversations(claims: AccessTokenClaims): Promise<{
        conversations: {
            id: string;
            title: string;
            updatedAt: string;
        }[];
    }>;
    getFinanceConversation(claims: AccessTokenClaims, id: string): Promise<{
        id: string;
        title: string;
        updatedAt: string;
        messages: {
            role: 'user' | 'assistant';
            content: string;
            at: string;
        }[];
    }>;
    financeChat(claims: AccessTokenClaims, dto: FinanceChatDto): Promise<{
        reply: string;
        conversationId: string;
    }>;
    receiptOcr(dto: ReceiptOcrDto): import("@ai-finance/shared-types").OcrReceiptExtraction;
    transcribe(file: {
        buffer: Buffer;
        originalname: string;
        mimetype: string;
    }): Promise<{
        transcript: string;
    }>;
}
