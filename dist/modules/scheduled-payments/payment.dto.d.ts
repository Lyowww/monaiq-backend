export declare class CreateScheduledPaymentDto {
    title: string;
    description?: string;
    amountMinor: number;
    dueDate: string;
    recurring: boolean;
    recurrenceType: 'none' | 'weekly' | 'monthly';
    category: 'utilities' | 'subscription' | 'rent' | 'other';
    reminderEnabled?: boolean;
}
export declare class UpdateScheduledPaymentDto {
    title?: string;
    description?: string;
    amountMinor?: number;
    dueDate?: string;
    recurring?: boolean;
    recurrenceType?: 'none' | 'weekly' | 'monthly';
    category?: 'utilities' | 'subscription' | 'rent' | 'other';
    status?: 'pending' | 'paid';
    reminderEnabled?: boolean;
}
export declare class MarkPaymentPaidDto {
    amountMinor?: number;
}
