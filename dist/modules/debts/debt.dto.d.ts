export declare class CreateDebtDto {
    personName: string;
    debtType?: 'I_OWE' | 'THEY_OWE';
    reason?: string;
    principalMinor: number;
    outstandingMinor?: number;
    minimumDueMinor: number;
    aprPercent: number;
    dueDate: string;
    relationship: 'family' | 'friend' | 'bank' | 'fintech' | 'other';
    reminderEnabled?: boolean;
}
export declare class UpdateDebtDto {
    personName?: string;
    lenderName?: string;
    debtType?: 'I_OWE' | 'THEY_OWE';
    reason?: string;
    principalMinor?: number;
    outstandingMinor?: number;
    minimumDueMinor?: number;
    aprPercent?: number;
    dueDate?: string;
    relationship?: 'family' | 'friend' | 'bank' | 'fintech' | 'other';
    status?: 'active' | 'settled' | 'defaulted';
    reminderEnabled?: boolean;
}
