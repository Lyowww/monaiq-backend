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
var TranslationService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TranslationService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
let TranslationService = TranslationService_1 = class TranslationService {
    configService;
    logger = new common_1.Logger(TranslationService_1.name);
    constructor(configService) {
        this.configService = configService;
    }
    baseUrl() {
        const raw = this.configService.get('TRANSLATION_SERVICE_URL') ?? 'http://127.0.0.1:8000';
        return raw.replace(/\/$/, '');
    }
    /**
     * Calls the local Go translation service (`POST /translate` with `from: auto` on the Go side).
     */
    async translate(text, to) {
        if (text.length === 0) {
            return text;
        }
        const url = `${this.baseUrl()}/translate`;
        let res;
        try {
            res = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text, to }),
                signal: AbortSignal.timeout(120_000)
            });
        }
        catch (err) {
            this.logger.error(`Translation request failed: ${err?.message ?? err}`);
            throw new common_1.ServiceUnavailableException('Translation service is not reachable. Start it with the backend (npm run start:dev) or set TRANSLATION_SERVICE_URL.');
        }
        let body;
        try {
            body = (await res.json());
        }
        catch {
            throw new common_1.ServiceUnavailableException('Translation service returned an invalid response.');
        }
        if (!res.ok || !body.status || typeof body.translatedText !== 'string') {
            const msg = body.message?.length ? body.message : `HTTP ${res.status}`;
            this.logger.warn(`Translation error: ${msg}`);
            throw new common_1.ServiceUnavailableException(`Translation failed: ${msg}`);
        }
        return body.translatedText;
    }
};
exports.TranslationService = TranslationService;
exports.TranslationService = TranslationService = TranslationService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], TranslationService);
//# sourceMappingURL=translation.service.js.map