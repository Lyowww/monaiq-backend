"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var OpenRouterLlmService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenRouterLlmService = exports.OPENROUTER_ALL_MODELS_FAILED_MESSAGE = exports.OPENROUTER_DEFAULT_FALLBACK_MODELS = void 0;
exports.sleep = sleep;
exports.getBackoffDelay = getBackoffDelay;
exports.isOpenRouterBadRequestError = isOpenRouterBadRequestError;
exports.isRetryableOpenRouterError = isRetryableOpenRouterError;
exports.shouldFallbackToNextModel = shouldFallbackToNextModel;
exports.mapOpenRouterFailureToException = mapOpenRouterFailureToException;
exports.buildLeanMessages = buildLeanMessages;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
exports.OPENROUTER_DEFAULT_FALLBACK_MODELS = [
    'google/gemma-3-12b-it:free',
    'google/gemma-4-31b-it:free',
    'google/gemma-3-4b-it:free'
];
const MAX_RETRIES_PER_MODEL = 2;
const ATTEMPTS_PER_MODEL = 1 + MAX_RETRIES_PER_MODEL;
const JITTER_MAX_MS = 500;
const DEFAULT_MAX_SYSTEM_CHARS = 12_000;
const DEFAULT_MAX_USER_CHARS = 14_000;
const MAX_HISTORY_TURNS = 6;
const RETRYABLE_OPENROUTER_ERROR_NAMES = new Set([
    'TooManyRequestsResponseError',
    'RequestTimeoutResponseError',
    'ServiceUnavailableResponseError',
    'InternalServerResponseError',
    'BadGatewayResponseError',
    'ProviderOverloadedResponseError',
    'EdgeNetworkTimeoutResponseError'
]);
function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
/**
 * @param retryNumber — 1 = delay before 2nd attempt, 2 = delay before 3rd attempt
 */
function getBackoffDelay(retryNumber) {
    const base = retryNumber === 1 ? 1200 : 2500;
    return base + Math.floor(Math.random() * JITTER_MAX_MS);
}
function isOpenRouterBadRequestError(err) {
    if (err === null || typeof err !== 'object') {
        return false;
    }
    const n = err.name;
    if (n === 'BadRequestResponseError' || n === 'PayloadTooLargeResponseError') {
        return true;
    }
    const sc = err.statusCode;
    return sc === 400;
}
function isUnprocessableOrValidationError(err) {
    if (err === null || typeof err !== 'object') {
        return false;
    }
    const n = err.name;
    return n === 'UnprocessableEntityResponseError' || n === 'SDKValidationError';
}
function isOpenRouterAuthError(err) {
    if (err === null || typeof err !== 'object') {
        return false;
    }
    const n = err.name;
    if (n === 'UnauthorizedResponseError' || n === 'ForbiddenResponseError' || n === 'PaymentRequiredResponseError') {
        return true;
    }
    const sc = err.statusCode;
    return sc === 401 || sc === 403;
}
function isModelNotFoundError(err) {
    if (err === null || typeof err !== 'object') {
        return false;
    }
    return err.name === 'NotFoundResponseError' || err.statusCode === 404;
}
function isNetworkTransientError(err) {
    if (!err || typeof err !== 'object') {
        return false;
    }
    const code = err.code;
    if (code === 'ECONNRESET' || code === 'ETIMEDOUT' || code === 'EPIPE' || code === 'UND_ERR_CONNECT_TIMEOUT') {
        return true;
    }
    const msg = String(err.message || '').toLowerCase();
    return /fetch failed|connection reset|socket|network|timed out|timeout|aborted|econnrefused|unavailable/.test(msg);
}
function isRetryableOpenRouterError(err) {
    if (err === null || typeof err !== 'object') {
        return isNetworkTransientError(err);
    }
    if (isOpenRouterAuthError(err) || isOpenRouterBadRequestError(err) || isUnprocessableOrValidationError(err)) {
        return false;
    }
    if (isModelNotFoundError(err)) {
        return false;
    }
    const n = err.name;
    if (n && RETRYABLE_OPENROUTER_ERROR_NAMES.has(n)) {
        return true;
    }
    const sc = err.statusCode;
    if (typeof sc === 'number' && (sc === 429 || sc === 500 || sc === 502 || sc === 503 || sc === 504)) {
        return true;
    }
    if (isNetworkTransientError(err)) {
        return true;
    }
    return false;
}
/**
 * If true, after exhausting per-model retries the caller can try the next OpenRouter model.
 * False for auth, bad/malformed body, and non-recoverable client errors.
 */
function shouldFallbackToNextModel(err) {
    if (isOpenRouterAuthError(err) || isOpenRouterBadRequestError(err) || isUnprocessableOrValidationError(err)) {
        return false;
    }
    if (isModelNotFoundError(err)) {
        return true;
    }
    return isRetryableOpenRouterError(err);
}
function mapOpenRouterFailureToException(err) {
    if (err instanceof common_1.ServiceUnavailableException || err instanceof common_1.BadRequestException || err instanceof common_1.InternalServerErrorException) {
        return err;
    }
    if (isOpenRouterAuthError(err)) {
        return new common_1.InternalServerErrorException('AI provider configuration is invalid.');
    }
    if (isOpenRouterBadRequestError(err) || isUnprocessableOrValidationError(err)) {
        return new common_1.BadRequestException('Invalid AI request.');
    }
    if (isRetryableOpenRouterError(err)) {
        return new common_1.ServiceUnavailableException('AI service is busy right now. Please try again in a few seconds.');
    }
    return new common_1.ServiceUnavailableException('AI service is temporarily unavailable. Please try again later.');
}
exports.OPENROUTER_ALL_MODELS_FAILED_MESSAGE = 'AI service is temporarily unavailable. Please try again later.';
function buildLeanMessages(input) {
    const maxSys = input.maxSystemChars ?? DEFAULT_MAX_SYSTEM_CHARS;
    const maxUsr = input.maxUserChars ?? DEFAULT_MAX_USER_CHARS;
    const maxHist = input.maxHistoryMessages ?? MAX_HISTORY_TURNS;
    const sysT = input.system.replace(/\r\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim();
    const usrT = input.user.replace(/\r\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim();
    let system = sysT;
    let systemTrimmed = false;
    if (system.length > maxSys) {
        system = system.slice(0, maxSys) + '…';
        systemTrimmed = true;
    }
    let user = usrT;
    let userTrimmed = false;
    if (user.length > maxUsr) {
        user = user.slice(0, maxUsr) + '\n\n(Տեքստի մի մասն այստեղ չի ներառվել՝ ծավալը սահմանափակելու համար։)';
        userTrimmed = true;
    }
    const history = (input.history ?? []).slice(-maxHist);
    const out = [
        { role: 'system', content: system }
    ];
    for (const m of history) {
        const c = m.content.trim();
        if (c.length > 0) {
            out.push({ role: m.role, content: c.length > 2000 ? c.slice(0, 2000) + '…' : c });
        }
    }
    out.push({ role: 'user', content: user });
    return { messages: out, trimmed: { system: systemTrimmed, user: userTrimmed } };
}
function extractAssistantText(result) {
    const content = result.choices[0]?.message?.content;
    if (typeof content === 'string') {
        const t = content.trim();
        return t.length > 0 ? t : null;
    }
    if (Array.isArray(content)) {
        const parts = [];
        for (const item of content) {
            if (item && typeof item === 'object' && typeof item.text === 'string') {
                parts.push(item.text);
            }
        }
        const joined = parts.join('').trim();
        return joined.length > 0 ? joined : null;
    }
    return null;
}
let OpenRouterLlmService = OpenRouterLlmService_1 = class OpenRouterLlmService {
    configService;
    logger = new common_1.Logger(OpenRouterLlmService_1.name);
    clientPromise = null;
    constructor(configService) {
        this.configService = configService;
    }
    isOpenRouterConfigured() {
        const k = this.configService.get('OPENROUTER_API_KEY');
        return typeof k === 'string' && k.trim().length > 0;
    }
    getFallbackModels() {
        const primary = this.configService.get('OPENROUTER_MODEL')?.trim();
        const default0 = exports.OPENROUTER_DEFAULT_FALLBACK_MODELS[0];
        const first = primary && primary.length > 0 ? primary : default0;
        const rest = exports.OPENROUTER_DEFAULT_FALLBACK_MODELS.filter((m) => m !== first);
        return [first, ...rest];
    }
    getModelId() {
        return this.getFallbackModels()[0];
    }
    getApiKey() {
        const key = this.configService.get('OPENROUTER_API_KEY');
        if (!key || key.trim().length === 0) {
            throw new common_1.ServiceUnavailableException('OpenRouter is not configured (missing OPENROUTER_API_KEY).');
        }
        return key.trim();
    }
    async loadSdk() {
        const { OpenRouter } = (await Promise.resolve().then(() => __importStar(require('@openrouter/sdk'))));
        return new OpenRouter({ apiKey: this.getApiKey() });
    }
    async getClient() {
        if (!this.clientPromise) {
            this.clientPromise = this.loadSdk();
        }
        return this.clientPromise;
    }
    /**
     * Single-turn (or with optional history) completion with system + user messages, non-streaming.
     * Applies lean context, per-model retries with backoff, then model fallbacks.
     */
    async completeSystemUser(system, user, options) {
        const { messages, trimmed } = buildLeanMessages({
            system,
            user,
            maxUserChars: options?.maxUserChars,
            maxSystemChars: options?.maxSystemChars,
            history: options?.history
        });
        if (trimmed.system || trimmed.user) {
            this.logger.log(`OpenRouter buildLeanMessages: systemTrimmed=${trimmed.system} userTrimmed=${trimmed.user}`);
        }
        const client = await this.getClient();
        const models = this.getFallbackModels();
        const started = Date.now();
        for (let mi = 0; mi < models.length; mi++) {
            const model = models[mi];
            const pathLabel = `model[${mi + 1}/${models.length}]=${model}`;
            try {
                const { text, hadRetries } = await this.tryModelWithRetries(client, model, messages, pathLabel, started);
                const ms = Date.now() - started;
                const parts = [`OpenRouter success with ${model} in ${ms}ms`];
                if (mi > 0) {
                    parts.push('(after model fallback)');
                }
                if (hadRetries) {
                    parts.push('(after per-model retries)');
                }
                this.logger.log(parts.join(' '));
                return text;
            }
            catch (err) {
                if (err instanceof common_1.InternalServerErrorException || err instanceof common_1.BadRequestException) {
                    throw err;
                }
                if (isOpenRouterAuthError(err)) {
                    this.logger.error(`OpenRouter auth/config error: ${err.message}`);
                    throw mapOpenRouterFailureToException(err);
                }
                if (isOpenRouterBadRequestError(err) || isUnprocessableOrValidationError(err)) {
                    this.logger.warn(`OpenRouter non-retryable on ${model}: ${err.message ?? err}`);
                    throw err;
                }
                if (mi < models.length - 1 && shouldFallbackToNextModel(err)) {
                    this.logger.warn(`Switching to fallback from ${model}: ${err.message ?? err}`);
                    continue;
                }
                this.logger.error(`OpenRouter: ${pathLabel} exhausted: ${err.message ?? err}`, err?.stack);
                if (isRetryableOpenRouterError(err) || isModelNotFoundError(err)) {
                    throw new common_1.ServiceUnavailableException(exports.OPENROUTER_ALL_MODELS_FAILED_MESSAGE);
                }
                throw mapOpenRouterFailureToException(err);
            }
        }
        this.logger.error('OpenRouter: no models in fallback list (misconfiguration).');
        throw new common_1.ServiceUnavailableException(exports.OPENROUTER_ALL_MODELS_FAILED_MESSAGE);
    }
    async tryModelWithRetries(client, model, messages, pathLabel, _started) {
        let lastErr;
        for (let attempt = 0; attempt < ATTEMPTS_PER_MODEL; attempt++) {
            if (attempt > 0) {
                const delay = getBackoffDelay(attempt === 1 ? 1 : 2);
                this.logger.log(`OpenRouter backoff ${delay}ms before re-attempt ${attempt + 1} on model ${model}`);
                await sleep(delay);
            }
            this.logger.log(`OpenRouter attempt ${attempt + 1} with ${model} (${pathLabel})`);
            try {
                const text = await this.callOpenRouter(client, model, messages);
                return { text, hadRetries: attempt > 0 };
            }
            catch (err) {
                lastErr = err;
                this.logProviderError(err, model, attempt + 1);
                if (isModelNotFoundError(err)) {
                    throw err;
                }
                if (isOpenRouterAuthError(err) || isOpenRouterBadRequestError(err) || isUnprocessableOrValidationError(err)) {
                    throw err;
                }
                if (!isRetryableOpenRouterError(err)) {
                    throw err;
                }
                if (attempt < ATTEMPTS_PER_MODEL - 1) {
                    continue;
                }
                throw err;
            }
        }
        throw lastErr;
    }
    logProviderError(err, model, attemptNumber) {
        const sc = err && typeof err === 'object' && 'statusCode' in err ? err.statusCode : '';
        const name = err && typeof err === 'object' && 'name' in err ? err.name : 'Error';
        this.logger.warn(`Retryable provider error on model ${model} (attempt ${attemptNumber}): ${name}${sc ? ` [${sc}]` : ''} — ${err?.message ?? err}`);
    }
    async callOpenRouter(client, model, messages) {
        const t0 = Date.now();
        const result = (await client.chat.send({
            chatRequest: {
                model,
                messages,
                stream: false
            }
        }));
        const text = extractAssistantText(result);
        if (text) {
            this.logger.log(`OpenRouter non-stream response OK model=${model} in ${Date.now() - t0}ms replyChars=${text.length}`);
            return text;
        }
        this.logger.warn('OpenRouter returned empty assistant content after successful API call');
        throw new common_1.ServiceUnavailableException('The assistant returned an empty response. Please try again.');
    }
    /**
     * Streams OpenRouter chat chunks; uses the same fallback model list and pre-stream retries.
     */
    async *streamUserMessage(userText) {
        const { messages: leanMsg } = buildLeanMessages({
            system: 'You are a helpful assistant. Be concise and clear.',
            user: userText,
            maxUserChars: DEFAULT_MAX_USER_CHARS
        });
        const client = await this.getClient();
        const models = this.getFallbackModels();
        let lastErr;
        outer: for (let mi = 0; mi < models.length; mi++) {
            const model = models[mi];
            for (let attempt = 0; attempt < ATTEMPTS_PER_MODEL; attempt++) {
                if (attempt > 0) {
                    const delay = getBackoffDelay(attempt === 1 ? 1 : 2);
                    this.logger.warn(`OpenRouter stream: retry ${attempt}/${MAX_RETRIES_PER_MODEL} on ${model} after ${delay}ms`);
                    await sleep(delay);
                }
                this.logger.log(`OpenRouter stream attempt ${attempt + 1} with ${model}`);
                try {
                    const stream = (await client.chat.send({
                        chatRequest: {
                            model,
                            messages: leanMsg,
                            stream: true
                        }
                    }));
                    for await (const raw of stream) {
                        if (raw.error) {
                            throw new Error(raw.error.message || 'OpenRouter stream error');
                        }
                        const delta = raw.choices[0]?.delta;
                        if (delta) {
                            const text = typeof delta.content === 'string' ? delta.content : '';
                            const reasoning = typeof delta.reasoning === 'string' ? delta.reasoning : '';
                            if (text.length > 0 || reasoning.length > 0) {
                                yield { kind: 'delta', text, reasoning };
                            }
                        }
                        if (raw.usage) {
                            const u = raw.usage;
                            const reasoningFromDetails = u.completionTokensDetails?.reasoningTokens;
                            yield {
                                kind: 'usage',
                                usage: {
                                    totalTokens: u.totalTokens,
                                    promptTokens: u.promptTokens,
                                    completionTokens: u.completionTokens,
                                    reasoningTokens: reasoningFromDetails ?? null
                                }
                            };
                        }
                    }
                    this.logger.log(`OpenRouter stream success with model ${model}`);
                    return;
                }
                catch (err) {
                    lastErr = err;
                    this.logProviderError(err, model, attempt + 1);
                    if (isOpenRouterAuthError(err) || isOpenRouterBadRequestError(err) || isUnprocessableOrValidationError(err)) {
                        throw mapOpenRouterFailureToException(err);
                    }
                    if (isModelNotFoundError(err) && mi < models.length - 1) {
                        this.logger.warn(`OpenRouter stream: model not found, switching: ${model}`);
                        continue outer;
                    }
                    if (isRetryableOpenRouterError(err) && attempt < ATTEMPTS_PER_MODEL - 1) {
                        continue;
                    }
                    if (isRetryableOpenRouterError(err) && shouldFallbackToNextModel(err) && mi < models.length - 1) {
                        this.logger.warn(`OpenRouter stream: switching to fallback from ${model}`);
                        continue outer;
                    }
                    throw mapOpenRouterFailureToException(err);
                }
            }
        }
        this.logger.error(`OpenRouter stream: all models failed: ${lastErr?.message ?? lastErr}`);
        throw new common_1.ServiceUnavailableException(exports.OPENROUTER_ALL_MODELS_FAILED_MESSAGE);
    }
};
exports.OpenRouterLlmService = OpenRouterLlmService;
exports.OpenRouterLlmService = OpenRouterLlmService = OpenRouterLlmService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], OpenRouterLlmService);
//# sourceMappingURL=openrouter-llm.service.js.map