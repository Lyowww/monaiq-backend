const GEMINI_BASE = 'https://generativelanguage.googleapis.com/v1beta';

/** Default when `GEMINI_MODEL` is not set in `.env`. */
export const DEFAULT_GEMINI_MODEL = 'gemini-2.0-flash';

export function normalizeGeminiModelId(model: string): string {
  return model.replace(/^models\//, '').trim();
}

/**
 * Read concatenated text from a successful `generateContent` JSON body.
 * Returns empty string if blocked or no text parts.
 */
export function extractGeminiResponseText(payload: unknown): string {
  if (!payload || typeof payload !== 'object') {
    return '';
  }
  const p = payload as Record<string, unknown>;
  const candidates = p.candidates;
  if (!Array.isArray(candidates) || candidates.length === 0) {
    return '';
  }
  const first = candidates[0] as Record<string, unknown>;
  const content = first.content;
  if (!content || typeof content !== 'object') {
    return '';
  }
  const parts = (content as { parts?: unknown }).parts;
  if (!Array.isArray(parts)) {
    return '';
  }
  const chunks: string[] = [];
  for (const part of parts) {
    if (part && typeof part === 'object' && typeof (part as { text?: string }).text === 'string') {
      chunks.push((part as { text: string }).text);
    }
  }
  return chunks.join('').trim();
}

type GeminiTextCallParams = {
  apiKey: string;
  model: string;
  systemInstruction: string;
  userText: string;
};

/**
 * `generateContent` for text with system + single user turn (Google AI / Gemini API).
 */
export async function geminiGenerateContentText(
  params: GeminiTextCallParams
): Promise<Response> {
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

export async function geminiGenerateTranscription(
  params: GeminiInlineAudioParams
): Promise<Response> {
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
