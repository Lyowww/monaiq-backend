export declare class UserProfileDto {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    currencyCode: 'AMD' | 'USD' | 'EUR';
    locale: string;
    dateOfBirth: string;
    isEmailVerified: boolean;
}
export declare class AuthSessionResponseDto {
    user: UserProfileDto;
    accessToken: string;
    refreshToken: string;
    accessTokenExpiresAt: string;
    refreshTokenExpiresAt: string;
}
export declare class SuccessResponseDto {
    success: true;
}
export declare class TransactionRecordDto {
    id: string;
    userId: string;
    debtId?: string;
    source: 'manual' | 'ocr' | 'voice' | 'bank_sync';
    category: string;
    direction: 'credit' | 'debit';
    amountMinor: number;
    currencyCode: 'AMD' | 'USD' | 'EUR';
    bookedAt: string;
    merchantName?: string;
    notes?: string;
    isTransfer: boolean;
    pocket?: 'cash' | 'card';
}
export declare class TransactionResponseDto extends TransactionRecordDto {
    quickCommandRaw?: string;
}
export declare class AiWarningDto {
    noteId: string;
    title: string;
    dueDate: string;
    projectedBalanceMinor: number;
    totalObligationMinor: number;
    severity: 'medium' | 'high' | 'critical';
    message: string;
}
export declare class DashboardSummaryDto {
    currencyCode: 'AMD' | 'USD' | 'EUR';
    liquidBalanceMinor: number;
    cardBalanceMinor: number;
    cashOnHandMinor: number;
    monthlyInflowMinor: number;
    monthlyOutflowMinor: number;
    obligationDueMinor: number;
    debtPressureScore: number;
    recentTransactions: TransactionRecordDto[];
    aiWarnings: AiWarningDto[];
    lastInsightAt?: string;
}
export declare class ReceiptOcrResponseDto {
    merchantName: string;
    bookedAtIso: string;
    amountMinor: number;
    currencyCode: 'AMD' | 'USD' | 'EUR';
    category: string;
    confidence: number;
    rawText: string;
}
export declare class TranscriptResponseDto {
    transcript: string;
}
