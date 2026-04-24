import type { OcrReceiptExtraction } from '@ai-finance/shared-types';
export declare class OcrService {
    extractReceiptFromRawText(rawText: string): OcrReceiptExtraction;
    private parseAmountToMinor;
    private normalizeDate;
}
