import { HttpException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
export declare const OPENROUTER_DEFAULT_FALLBACK_MODELS: readonly string[];
export type LeanChatHistory = Array<{
    role: 'user' | 'assistant';
    content: string;
}>;
export declare function sleep(ms: number): Promise<void>;
/**
 * @param retryNumber — 1 = delay before 2nd attempt, 2 = delay before 3rd attempt
 */
export declare function getBackoffDelay(retryNumber: 1 | 2): number;
export declare function isOpenRouterBadRequestError(err: unknown): boolean;
export declare function isRetryableOpenRouterError(err: unknown): boolean;
/**
 * If true, after exhausting per-model retries the caller can try the next OpenRouter model.
 * False for auth, bad/malformed body, and non-recoverable client errors.
 */
export declare function shouldFallbackToNextModel(err: unknown): boolean;
export declare function mapOpenRouterFailureToException(err: unknown): HttpException;
export declare const OPENROUTER_ALL_MODELS_FAILED_MESSAGE = "AI service is temporarily unavailable. Please try again later.";
export declare function buildLeanMessages(input: {
    system: string;
    user: string;
    history?: Array<{
        role: 'user' | 'assistant';
        content: string;
    }>;
    maxUserChars?: number;
    maxSystemChars?: number;
    maxHistoryMessages?: number;
}): {
    messages: {
        role: 'system' | 'user' | 'assistant';
        content: string;
    }[];
    trimmed: {
        system: boolean;
        user: boolean;
    };
};
export declare class OpenRouterLlmService {
    private readonly configService;
    private readonly logger;
    private clientPromise;
    constructor(configService: ConfigService);
    isOpenRouterConfigured(): boolean;
    getFallbackModels(): string[];
    getModelId(): string;
    private getApiKey;
    private loadSdk;
    private getClient;
    /**
     * Single-turn (or with optional history) completion with system + user messages, non-streaming.
     * Applies lean context, per-model retries with backoff, then model fallbacks.
     */
    completeSystemUser(system: string, user: string, options?: {
        maxUserChars?: number;
        maxSystemChars?: number;
        history?: LeanChatHistory;
    }): Promise<string>;
    private tryModelWithRetries;
    private logProviderError;
    private callOpenRouter;
    /**
     * Streams OpenRouter chat chunks; uses the same fallback model list and pre-stream retries.
     */
    streamUserMessage(userText: string): AsyncGenerator<{
        kind: 'delta';
        text: string;
        reasoning: string;
    } | {
        kind: 'usage';
        usage: Record<string, unknown>;
    }>;
}
