"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpeechService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const gemini_llm_util_1 = require("./gemini-llm.util");
function resolveAudioMimeType(fileName, mimeType) {
    const fromClient = (mimeType || 'audio/mp4').trim() || 'audio/mp4';
    const lower = fileName.toLowerCase();
    if (fromClient === 'audio/x-m4a' || fromClient === 'audio/m4a' || lower.endsWith('.m4a')) {
        return 'audio/mp4';
    }
    return fromClient;
}
let SpeechService = class SpeechService {
    configService;
    constructor(configService) {
        this.configService = configService;
    }
    async transcribeAudio(audioBuffer, fileName, mimeType) {
        const apiKey = this.configService.get('GEMINI_API_KEY');
        if (!apiKey) {
            throw new common_1.ServiceUnavailableException('Speech transcription provider is not configured');
        }
        const model = this.configService.get('GEMINI_MODEL') ?? gemini_llm_util_1.DEFAULT_GEMINI_MODEL;
        const resolvedMime = resolveAudioMimeType(fileName || '', mimeType);
        const base64 = audioBuffer.toString('base64');
        const response = await (0, gemini_llm_util_1.geminiGenerateTranscription)({
            apiKey,
            model,
            base64,
            mimeType: resolvedMime,
            instruction: 'Transcribe the speech accurately. The speaker may use Armenian (Հայերեն) or English. ' +
                'Return only the transcript text, with no labels or commentary.'
        });
        if (!response.ok) {
            const errorText = await response.text();
            throw new common_1.BadGatewayException(`Speech transcription failed: ${errorText}`);
        }
        const payload = (await response.json());
        const text = (0, gemini_llm_util_1.extractGeminiResponseText)(payload);
        if (!text) {
            throw new common_1.BadGatewayException('Speech transcription provider returned an empty transcript');
        }
        return text.trim();
    }
};
exports.SpeechService = SpeechService;
exports.SpeechService = SpeechService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], SpeechService);
//# sourceMappingURL=speech.service.js.map