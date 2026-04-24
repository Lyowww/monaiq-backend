import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  Logger,
  ServiceUnavailableException
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export const OPENROUTER_DEFAULT_FALLBACK_MODELS: readonly string[] = [
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

export type LeanChatHistory = Array<{ role: 'user' | 'assistant'; content: string }>;

const RETRYABLE_OPENROUTER_ERROR_NAMES = new Set<string>([
  'TooManyRequestsResponseError',
  'RequestTimeoutResponseError',
  'ServiceUnavailableResponseError',
  'InternalServerResponseError',
  'BadGatewayResponseError',
  'ProviderOverloadedResponseError',
  'EdgeNetworkTimeoutResponseError'
]);

type SystemUserMessage =
  | { role: 'system' | 'user' | 'assistant'; content: string }
  | { role: 'user' | 'assistant'; content: string };

type OpenRouterModule = {
  OpenRouter: new (opts: { apiKey: string }) => {
    chat: {
      send: (req: {
        chatRequest: {
          model: string;
          messages: SystemUserMessage[] | Array<{ role: 'user'; content: string }>;
          stream: boolean;
        };
      }) => Promise<AsyncIterable<StreamChunk> | NonStreamResult>;
    };
  };
};

type NonStreamResult = {
  choices: Array<{
    message?: { content?: string | null | Array<{ type?: string; text?: string }> };
  }>;
};

type StreamChunk = {
  choices: Array<{
    delta: {
      content?: string | null;
      reasoning?: string | null;
    };
  }>;
  usage?: {
    totalTokens: number;
    promptTokens: number;
    completionTokens: number;
    completionTokensDetails?: { reasoningTokens?: number | null } | null;
  };
  error?: { code: number; message: string };
};

type OpenRouterClient = InstanceType<OpenRouterModule['OpenRouter']>;

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * @param retryNumber — 1 = delay before 2nd attempt, 2 = delay before 3rd attempt
 */
export function getBackoffDelay(retryNumber: 1 | 2): number {
  const base = retryNumber === 1 ? 1200 : 2500;
  return base + Math.floor(Math.random() * JITTER_MAX_MS);
}

export function isOpenRouterBadRequestError(err: unknown): boolean {
  if (err === null || typeof err !== 'object') {
    return false;
  }
  const n = (err as { name?: string }).name;
  if (n === 'BadRequestResponseError' || n === 'PayloadTooLargeResponseError') {
    return true;
  }
  const sc = (err as { statusCode?: number }).statusCode;
  return sc === 400;
}

function isUnprocessableOrValidationError(err: unknown): boolean {
  if (err === null || typeof err !== 'object') {
    return false;
  }
  const n = (err as { name?: string }).name;
  return n === 'UnprocessableEntityResponseError' || n === 'SDKValidationError';
}

function isOpenRouterAuthError(err: unknown): boolean {
  if (err === null || typeof err !== 'object') {
    return false;
  }
  const n = (err as { name?: string }).name;
  if (n === 'UnauthorizedResponseError' || n === 'ForbiddenResponseError' || n === 'PaymentRequiredResponseError') {
    return true;
  }
  const sc = (err as { statusCode?: number }).statusCode;
  return sc === 401 || sc === 403;
}

function isModelNotFoundError(err: unknown): boolean {
  if (err === null || typeof err !== 'object') {
    return false;
  }
  return (err as { name?: string }).name === 'NotFoundResponseError' || (err as { statusCode?: number }).statusCode === 404;
}

function isNetworkTransientError(err: unknown): boolean {
  if (!err || typeof err !== 'object') {
    return false;
  }
  const code = (err as { code?: string }).code;
  if (code === 'ECONNRESET' || code === 'ETIMEDOUT' || code === 'EPIPE' || code === 'UND_ERR_CONNECT_TIMEOUT') {
    return true;
  }
  const msg = String((err as Error).message || '').toLowerCase();
  return /fetch failed|connection reset|socket|network|timed out|timeout|aborted|econnrefused|unavailable/.test(
    msg
  );
}

export function isRetryableOpenRouterError(err: unknown): boolean {
  if (err === null || typeof err !== 'object') {
    return isNetworkTransientError(err);
  }
  if (isOpenRouterAuthError(err) || isOpenRouterBadRequestError(err) || isUnprocessableOrValidationError(err)) {
    return false;
  }
  if (isModelNotFoundError(err)) {
    return false;
  }
  const n = (err as { name?: string }).name;
  if (n && RETRYABLE_OPENROUTER_ERROR_NAMES.has(n)) {
    return true;
  }
  const sc = (err as { statusCode?: number }).statusCode;
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
export function shouldFallbackToNextModel(err: unknown): boolean {
  if (isOpenRouterAuthError(err) || isOpenRouterBadRequestError(err) || isUnprocessableOrValidationError(err)) {
    return false;
  }
  if (isModelNotFoundError(err)) {
    return true;
  }
  return isRetryableOpenRouterError(err);
}

export function mapOpenRouterFailureToException(err: unknown): HttpException {
  if (err instanceof ServiceUnavailableException || err instanceof BadRequestException || err instanceof InternalServerErrorException) {
    return err;
  }
  if (isOpenRouterAuthError(err)) {
    return new InternalServerErrorException('AI provider configuration is invalid.');
  }
  if (isOpenRouterBadRequestError(err) || isUnprocessableOrValidationError(err)) {
    return new BadRequestException('Invalid AI request.');
  }
  if (isRetryableOpenRouterError(err)) {
    return new ServiceUnavailableException(
      'AI service is busy right now. Please try again in a few seconds.'
    );
  }
  return new ServiceUnavailableException('AI service is temporarily unavailable. Please try again later.');
}

export const OPENROUTER_ALL_MODELS_FAILED_MESSAGE =
  'AI service is temporarily unavailable. Please try again later.';

export function buildLeanMessages(input: {
  system: string;
  user: string;
  history?: Array<{ role: 'user' | 'assistant'; content: string }>;
  maxUserChars?: number;
  maxSystemChars?: number;
  maxHistoryMessages?: number;
}): {
  messages: { role: 'system' | 'user' | 'assistant'; content: string }[];
  trimmed: { system: boolean; user: boolean };
} {
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
  const out: { role: 'system' | 'user' | 'assistant'; content: string }[] = [
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

function extractAssistantText(result: NonStreamResult): string | null {
  const content = result.choices[0]?.message?.content;
  if (typeof content === 'string') {
    const t = content.trim();
    return t.length > 0 ? t : null;
  }
  if (Array.isArray(content)) {
    const parts: string[] = [];
    for (const item of content) {
      if (item && typeof item === 'object' && typeof (item as { text?: string }).text === 'string') {
        parts.push((item as { text: string }).text);
      }
    }
    const joined = parts.join('').trim();
    return joined.length > 0 ? joined : null;
  }
  return null;
}

@Injectable()
export class OpenRouterLlmService {
  private readonly logger = new Logger(OpenRouterLlmService.name);
  private clientPromise: Promise<OpenRouterClient> | null = null;

  constructor(private readonly configService: ConfigService) {}

  isOpenRouterConfigured(): boolean {
    const k = this.configService.get<string>('OPENROUTER_API_KEY');
    return typeof k === 'string' && k.trim().length > 0;
  }

  getFallbackModels(): string[] {
    const primary = this.configService.get<string>('OPENROUTER_MODEL')?.trim();
    const default0 = OPENROUTER_DEFAULT_FALLBACK_MODELS[0] as string;
    const first: string = primary && primary.length > 0 ? primary : default0;
    const rest = OPENROUTER_DEFAULT_FALLBACK_MODELS.filter((m) => m !== first);
    return [first, ...rest];
  }

  getModelId(): string {
    return this.getFallbackModels()[0] as string;
  }

  private getApiKey(): string {
    const key = this.configService.get<string>('OPENROUTER_API_KEY');
    if (!key || key.trim().length === 0) {
      throw new ServiceUnavailableException('OpenRouter is not configured (missing OPENROUTER_API_KEY).');
    }
    return key.trim();
  }

  private async loadSdk(): Promise<OpenRouterClient> {
    const { OpenRouter } = (await import(
      '@openrouter/sdk'
    )) as unknown as OpenRouterModule;
    return new OpenRouter({ apiKey: this.getApiKey() });
  }

  private async getClient(): Promise<OpenRouterClient> {
    if (!this.clientPromise) {
      this.clientPromise = this.loadSdk();
    }
    return this.clientPromise;
  }

  /**
   * Single-turn (or with optional history) completion with system + user messages, non-streaming.
   * Applies lean context, per-model retries with backoff, then model fallbacks.
   */
  async completeSystemUser(
    system: string,
    user: string,
    options?: { maxUserChars?: number; maxSystemChars?: number; history?: LeanChatHistory }
  ): Promise<string> {
    const { messages, trimmed } = buildLeanMessages({
      system,
      user,
      maxUserChars: options?.maxUserChars,
      maxSystemChars: options?.maxSystemChars,
      history: options?.history
    });
    if (trimmed.system || trimmed.user) {
      this.logger.log(
        `OpenRouter buildLeanMessages: systemTrimmed=${trimmed.system} userTrimmed=${trimmed.user}`
      );
    }

    const client = await this.getClient();
    const models = this.getFallbackModels();
    const started = Date.now();

    for (let mi = 0; mi < models.length; mi++) {
      const model = models[mi]!;
      const pathLabel = `model[${mi + 1}/${models.length}]=${model}`;

      try {
        const { text, hadRetries } = await this.tryModelWithRetries(
          client,
          model,
          messages,
          pathLabel
        );
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
      } catch (err) {
        if (err instanceof InternalServerErrorException || err instanceof BadRequestException) {
          throw err;
        }
        if (isOpenRouterAuthError(err)) {
          this.logger.error(`OpenRouter auth/config error: ${(err as Error).message}`);
          throw mapOpenRouterFailureToException(err);
        }
        if (isOpenRouterBadRequestError(err) || isUnprocessableOrValidationError(err)) {
          this.logger.warn(`OpenRouter non-retryable on ${model}: ${(err as Error).message ?? err}`);
          throw err;
        }
        if (mi < models.length - 1 && shouldFallbackToNextModel(err)) {
          this.logger.warn(`Switching to fallback from ${model}: ${(err as Error).message ?? err}`);
          continue;
        }
        this.logger.error(
          `OpenRouter: ${pathLabel} exhausted: ${(err as Error).message ?? err}`,
          (err as Error)?.stack
        );
        if (isRetryableOpenRouterError(err) || isModelNotFoundError(err)) {
          throw new ServiceUnavailableException(OPENROUTER_ALL_MODELS_FAILED_MESSAGE);
        }
        throw mapOpenRouterFailureToException(err);
      }
    }

    this.logger.error('OpenRouter: no models in fallback list (misconfiguration).');
    throw new ServiceUnavailableException(OPENROUTER_ALL_MODELS_FAILED_MESSAGE);
  }

  private async tryModelWithRetries(
    client: OpenRouterClient,
    model: string,
    messages: { role: 'system' | 'user' | 'assistant'; content: string }[],
    pathLabel: string
  ): Promise<{ text: string; hadRetries: boolean }> {
    let lastErr: unknown;
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
      } catch (err) {
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

  private logProviderError(err: unknown, model: string, attemptNumber: number): void {
    const sc = err && typeof err === 'object' && 'statusCode' in err ? (err as { statusCode: number }).statusCode : '';
    const name = err && typeof err === 'object' && 'name' in err ? (err as { name: string }).name : 'Error';
    this.logger.warn(
      `Retryable provider error on model ${model} (attempt ${attemptNumber}): ${name}${sc ? ` [${sc}]` : ''} — ${(err as Error)?.message ?? err}`
    );
  }

  private async callOpenRouter(
    client: OpenRouterClient,
    model: string,
    messages: { role: 'system' | 'user' | 'assistant'; content: string }[]
  ): Promise<string> {
    const t0 = Date.now();
    const result = (await client.chat.send({
      chatRequest: {
        model,
        messages,
        stream: false
      }
    })) as NonStreamResult;

    const text = extractAssistantText(result);
    if (text) {
      this.logger.log(`OpenRouter non-stream response OK model=${model} in ${Date.now() - t0}ms replyChars=${text.length}`);
      return text;
    }

    this.logger.warn('OpenRouter returned empty assistant content after successful API call');
    throw new ServiceUnavailableException(
      'The assistant returned an empty response. Please try again.'
    );
  }

  /**
   * Streams OpenRouter chat chunks; uses the same fallback model list and pre-stream retries.
   */
  async *streamUserMessage(
    userText: string
  ): AsyncGenerator<
    { kind: 'delta'; text: string; reasoning: string } | { kind: 'usage'; usage: Record<string, unknown> }
  > {
    const { messages: leanMsg } = buildLeanMessages({
      system: 'You are a helpful assistant. Be concise and clear.',
      user: userText,
      maxUserChars: DEFAULT_MAX_USER_CHARS
    });

    const client = await this.getClient();
    const models = this.getFallbackModels();
    let lastErr: unknown;

    outer: for (let mi = 0; mi < models.length; mi++) {
      const model = models[mi]!;

      for (let attempt = 0; attempt < ATTEMPTS_PER_MODEL; attempt++) {
        if (attempt > 0) {
          const delay = getBackoffDelay(attempt === 1 ? 1 : 2);
          this.logger.warn(
            `OpenRouter stream: retry ${attempt}/${MAX_RETRIES_PER_MODEL} on ${model} after ${delay}ms`
          );
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
          })) as AsyncIterable<StreamChunk>;

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
        } catch (err) {
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

    this.logger.error(`OpenRouter stream: all models failed: ${(lastErr as Error)?.message ?? lastErr}`);
    throw new ServiceUnavailableException(OPENROUTER_ALL_MODELS_FAILED_MESSAGE);
  }
}
