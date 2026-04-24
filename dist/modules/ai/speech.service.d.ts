import { ConfigService } from '@nestjs/config';
export declare class SpeechService {
    private readonly configService;
    constructor(configService: ConfigService);
    transcribeAudio(audioBuffer: Buffer, fileName: string, mimeType: string): Promise<string>;
}
