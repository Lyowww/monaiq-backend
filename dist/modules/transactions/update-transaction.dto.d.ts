export declare class UpdateTransactionDto {
    source?: 'manual' | 'ocr' | 'voice' | 'bank_sync' | 'suggestion';
    category?: string;
    subcategory?: string;
    amountMinor?: number;
    bookedAt?: string;
    merchantName?: string;
    notes?: string;
    incomeSource?: 'salary' | 'freelance' | 'gift' | 'other';
    recurring?: boolean;
    recurrenceType?: 'none' | 'monthly' | 'weekly';
}
