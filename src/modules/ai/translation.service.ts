import { Injectable, Logger, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

const DEFAULT_TRANSLATE_URL =
  'https://monaiq-translator.vercel.app/api/admin/translate';
const DEFAULT_TRANSLATE_ACCESS_TOKEN = 'random-token';

type TranslateApiResponse = {
  translatedText?: string;
  /** Legacy local sidecar */
  status?: boolean;
  message?: string;
};

@Injectable()
export class TranslationService {
  private readonly logger = new Logger(TranslationService.name);

  constructor(private readonly configService: ConfigService) {}

  private translateUrl(): string {
    const explicit = this.configService.get<string>('TRANSLATION_API_URL');
    if (explicit?.length) {
      return explicit.replace(/\/$/, '');
    }
    const legacyBase = this.configService.get<string>('TRANSLATION_SERVICE_URL');
    if (legacyBase?.length) {
      return `${legacyBase.replace(/\/$/, '')}/translate`;
    }
    return DEFAULT_TRANSLATE_URL;
  }

  private accessToken(): string {
    return (
      this.configService.get<string>('TRANSLATION_ACCESS_TOKEN') ??
      DEFAULT_TRANSLATE_ACCESS_TOKEN
    );
  }

  /** Local Go sidecar uses plain JSON; hosted admin API expects Bearer token. */
  private requestHeaders(): Record<string, string> {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    const explicit = this.configService.get<string>('TRANSLATION_API_URL');
    const legacyBase = this.configService.get<string>('TRANSLATION_SERVICE_URL');
    const legacyOnly = legacyBase?.length && !explicit?.length;
    if (!legacyOnly) {
      headers.Authorization = `Bearer ${this.accessToken()}`;
    }
    return headers;
  }

  /**
   * Calls the hosted translator (`POST` with JSON `{ text, to }`, Bearer access token).
   */
  async translate(text: string, to: 'en' | 'hy'): Promise<string> {
    if (text.length === 0) {
      return text;
    }

    const url = this.translateUrl();
    let res: Response;
    try {
      res = await fetch(url, {
        method: 'POST',
        headers: this.requestHeaders(),
        body: JSON.stringify({ text, to }),
        signal: AbortSignal.timeout(120_000)
      });
    } catch (err) {
      this.logger.error(`Translation request failed: ${(err as Error)?.message ?? err}`);
      throw new ServiceUnavailableException(
        'Translation service is not reachable. Check TRANSLATION_API_URL or network access.'
      );
    }

    let body: TranslateApiResponse;
    try {
      body = (await res.json()) as TranslateApiResponse;
    } catch {
      throw new ServiceUnavailableException('Translation service returned an invalid response.');
    }

    if (!res.ok) {
      const msg = body.message?.length ? body.message : `HTTP ${res.status}`;
      this.logger.warn(`Translation error: ${msg}`);
      throw new ServiceUnavailableException(`Translation failed: ${msg}`);
    }

    const legacyFail = body.status === false;
    const out = body.translatedText;
    if (legacyFail || typeof out !== 'string') {
      const msg = body.message?.length ? body.message : 'Missing translatedText in response';
      this.logger.warn(`Translation error: ${msg}`);
      throw new ServiceUnavailableException(`Translation failed: ${msg}`);
    }

    return out;
  }
}
