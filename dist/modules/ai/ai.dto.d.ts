export declare class ReceiptOcrDto {
    rawText: string;
}
export declare class FinanceChatDto {
    message: string;
    /** Continue an existing thread; omit to start a new saved conversation. */
    conversationId?: string;
    /** Matches app UI: English vs Eastern Armenian assistant replies. */
    replyLanguage?: 'en' | 'hy';
}
export declare class OpenRouterChatDto {
    message: string;
    /** When `hy`, the message is translated to English for the model and the streamed reply is translated back to Armenian. */
    replyLanguage?: 'en' | 'hy';
}
