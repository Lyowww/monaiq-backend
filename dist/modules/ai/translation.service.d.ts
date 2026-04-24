import { ConfigService } from '@nestjs/config';
export declare class TranslationService {
    private readonly configService;
    private readonly logger;
    constructor(configService: ConfigService);
    private baseUrl;
    /**
     * Calls the local Go translation service (`POST /translate` with `from: auto` on the Go side).
     */
    translate(text: string, to: 'en' | 'hy'): Promise<string>;
}
