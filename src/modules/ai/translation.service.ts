import { Injectable, Logger, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

type TranslateApiResponse = {
  translatedText?: string;
  status: boolean;
  message?: string;
};

@Injectable()
export class TranslationService {
  private readonly logger = new Logger(TranslationService.name);

  constructor(private readonly configService: ConfigService) {}

  private baseUrl(): string {
    const raw =
      this.configService.get<string>('TRANSLATION_SERVICE_URL') ?? 'http://127.0.0.1:8000';
    return raw.replace(/\/$/, '');
  }

  /**
   * Calls the local Go translation service (`POST /translate` with `from: auto` on the Go side).
   */
  async translate(text: string, to: 'en' | 'hy'): Promise<string> {
    if (text.length === 0) {
      return text;
    }

    const url = `${this.baseUrl()}/translate`;
    let res: Response;
    try {
      res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, to }),
        signal: AbortSignal.timeout(120_000)
      });
    } catch (err) {
      this.logger.error(`Translation request failed: ${(err as Error)?.message ?? err}`);
      throw new ServiceUnavailableException(
        'Translation service is not reachable. Start it with the backend (npm run start:dev) or set TRANSLATION_SERVICE_URL.'
      );
    }

    let body: TranslateApiResponse;
    try {
      body = (await res.json()) as TranslateApiResponse;
    } catch {
      throw new ServiceUnavailableException('Translation service returned an invalid response.');
    }

    if (!res.ok || !body.status || typeof body.translatedText !== 'string') {
      const msg = body.message?.length ? body.message : `HTTP ${res.status}`;
      this.logger.warn(`Translation error: ${msg}`);
      throw new ServiceUnavailableException(`Translation failed: ${msg}`);
    }

    return body.translatedText;
  }
}
