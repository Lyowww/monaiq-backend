import { BadGatewayException, Injectable, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  DEFAULT_GEMINI_MODEL,
  extractGeminiResponseText,
  geminiGenerateTranscription
} from './gemini-llm.util';

function resolveAudioMimeType(fileName: string, mimeType: string): string {
  const fromClient = (mimeType || 'audio/mp4').trim() || 'audio/mp4';
  const lower = fileName.toLowerCase();
  if (fromClient === 'audio/x-m4a' || fromClient === 'audio/m4a' || lower.endsWith('.m4a')) {
    return 'audio/mp4';
  }
  return fromClient;
}

@Injectable()
export class SpeechService {
  constructor(private readonly configService: ConfigService) {}

  async transcribeAudio(
    audioBuffer: Buffer,
    fileName: string,
    mimeType: string
  ): Promise<string> {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    if (!apiKey) {
      throw new ServiceUnavailableException('Speech transcription provider is not configured');
    }
    const model = this.configService.get<string>('GEMINI_MODEL') ?? DEFAULT_GEMINI_MODEL;
    const resolvedMime = resolveAudioMimeType(fileName || '', mimeType);
    const base64 = audioBuffer.toString('base64');

    const response = await geminiGenerateTranscription({
      apiKey,
      model,
      base64,
      mimeType: resolvedMime,
      instruction:
        'Transcribe the speech accurately. The speaker may use Armenian (Հայերեն) or English. ' +
        'Return only the transcript text, with no labels or commentary.'
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new BadGatewayException(`Speech transcription failed: ${errorText}`);
    }

    const payload = (await response.json()) as unknown;
    const text = extractGeminiResponseText(payload);
    if (!text) {
      throw new BadGatewayException('Speech transcription provider returned an empty transcript');
    }

    return text.trim();
  }
}
