/** Default when `GEMINI_MODEL` is not set in `.env`. */
export declare const DEFAULT_GEMINI_MODEL = "gemini-2.0-flash";
export declare function normalizeGeminiModelId(model: string): string;
/**
 * Read concatenated text from a successful `generateContent` JSON body.
 * Returns empty string if blocked or no text parts.
 */
export declare function extractGeminiResponseText(payload: unknown): string;
type GeminiTextCallParams = {
    apiKey: string;
    model: string;
    systemInstruction: string;
    userText: string;
};
/**
 * `generateContent` for text with system + single user turn (Google AI / Gemini API).
 */
export declare function geminiGenerateContentText(params: GeminiTextCallParams): Promise<Response>;
type GeminiInlineAudioParams = {
    apiKey: string;
    model: string;
    /** Raw audio bytes, base64-encoded in the request */
    base64: string;
    /** e.g. audio/mp4, audio/wav */
    mimeType: string;
    /** Short instruction, e.g. transcribe in Armenian/English */
    instruction: string;
};
export declare function geminiGenerateTranscription(params: GeminiInlineAudioParams): Promise<Response>;
export {};
