"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_GEMINI_MODEL = void 0;
exports.normalizeGeminiModelId = normalizeGeminiModelId;
exports.extractGeminiResponseText = extractGeminiResponseText;
exports.geminiGenerateContentText = geminiGenerateContentText;
exports.geminiGenerateTranscription = geminiGenerateTranscription;
const GEMINI_BASE = 'https://generativelanguage.googleapis.com/v1beta';
/** Default when `GEMINI_MODEL` is not set in `.env`. */
exports.DEFAULT_GEMINI_MODEL = 'gemini-2.0-flash';
function normalizeGeminiModelId(model) {
    return model.replace(/^models\//, '').trim();
}
/**
 * Read concatenated text from a successful `generateContent` JSON body.
 * Returns empty string if blocked or no text parts.
 */
function extractGeminiResponseText(payload) {
    if (!payload || typeof payload !== 'object') {
        return '';
    }
    const p = payload;
    const candidates = p.candidates;
    if (!Array.isArray(candidates) || candidates.length === 0) {
        return '';
    }
    const first = candidates[0];
    const content = first.content;
    if (!content || typeof content !== 'object') {
        return '';
    }
    const parts = content.parts;
    if (!Array.isArray(parts)) {
        return '';
    }
    const chunks = [];
    for (const part of parts) {
        if (part && typeof part === 'object' && typeof part.text === 'string') {
            chunks.push(part.text);
        }
    }
    return chunks.join('').trim();
}
/**
 * `generateContent` for text with system + single user turn (Google AI / Gemini API).
 */
async function geminiGenerateContentText(params) {
    const { apiKey, model, systemInstruction, userText } = params;
    const id = encodeURIComponent(normalizeGeminiModelId(model));
    const url = `${GEMINI_BASE}/models/${id}:generateContent?key=${encodeURIComponent(apiKey)}`;
    return fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            systemInstruction: {
                parts: [{ text: systemInstruction }]
            },
            contents: [
                {
                    role: 'user',
                    parts: [{ text: userText }]
                }
            ]
        })
    });
}
async function geminiGenerateTranscription(params) {
    const { apiKey, model, base64, mimeType, instruction } = params;
    const id = encodeURIComponent(normalizeGeminiModelId(model));
    const url = `${GEMINI_BASE}/models/${id}:generateContent?key=${encodeURIComponent(apiKey)}`;
    return fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            contents: [
                {
                    role: 'user',
                    parts: [
                        { text: instruction },
                        {
                            inlineData: {
                                mimeType,
                                data: base64
                            }
                        }
                    ]
                }
            ],
            generationConfig: {
                temperature: 0.2,
                maxOutputTokens: 1024
            }
        })
    });
}
//# sourceMappingURL=gemini-llm.util.js.map