export declare class CreateTransactionDto {
    source: 'manual' | 'ocr' | 'voice' | 'bank_sync' | 'suggestion';
    category: string;
    subcategory?: string;
    direction: 'credit' | 'debit';
    amountMinor: number;
    currencyCode?: 'AMD';
    bookedAt: string;
    merchantName?: string;
    notes?: string;
    isTransfer?: boolean;
    debtId?: string;
    quickCommandRaw?: string;
    incomeSource?: 'salary' | 'freelance' | 'gift' | 'other';
    recurring?: boolean;
    recurrenceType?: 'none' | 'monthly' | 'weekly';
    pocket?: 'cash' | 'card';
}
