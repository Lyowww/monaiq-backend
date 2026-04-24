"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OcrService = void 0;
const common_1 = require("@nestjs/common");
let OcrService = class OcrService {
    extractReceiptFromRawText(rawText) {
        const normalized = rawText.replace(/\s+/g, ' ').trim();
        const amountMatch = normalized.match(/(\d[\d.,\s]{1,15})\s?(AMD|֏)/i);
        const merchantMatch = normalized.match(/^([A-Za-z0-9\u0531-\u0556\u0561-\u0587\s.'&-]{2,80})/);
        const dateMatch = normalized.match(/(\d{4}-\d{2}-\d{2}|\d{2}[./-]\d{2}[./-]\d{4}|\d{2}[./-]\d{2}[./-]\d{2})/);
        const amountText = amountMatch?.[1];
        const matchedDate = dateMatch?.[1];
        const amountMinor = amountText ? this.parseAmountToMinor(amountText) : 0;
        const bookedAtIso = matchedDate ? this.normalizeDate(matchedDate) : new Date().toISOString();
        return {
            merchantName: merchantMatch?.[1]?.trim() ?? 'Unknown Merchant',
            bookedAtIso,
            amountMinor,
            currencyCode: 'AMD',
            category: 'general',
            confidence: amountMatch ? 0.82 : 0.46,
            rawText
        };
    }
    parseAmountToMinor(rawAmount) {
        const normalized = rawAmount.replace(/[^\d.,]/g, '').replace(/,/g, '');
        const majorUnits = Number(normalized);
        if (!Number.isFinite(majorUnits)) {
            return 0;
        }
        return Math.round(majorUnits * 100);
    }
    normalizeDate(rawDate) {
        if (rawDate.includes('-') && rawDate.length === 10 && rawDate.startsWith('20')) {
            return new Date(`${rawDate}T00:00:00.000Z`).toISOString();
        }
        const parts = rawDate.split(/[./-]/);
        if (parts.length !== 3) {
            return new Date().toISOString();
        }
        const [dayPart, monthPart, yearPart] = parts;
        if (!dayPart || !monthPart || !yearPart) {
            return new Date().toISOString();
        }
        const normalizedYear = yearPart.length === 2 ? `20${yearPart}` : yearPart;
        return new Date(`${normalizedYear}-${monthPart}-${dayPart}T00:00:00.000Z`).toISOString();
    }
};
exports.OcrService = OcrService;
exports.OcrService = OcrService = __decorate([
    (0, common_1.Injectable)()
], OcrService);
//# sourceMappingURL=ocr.service.js.map