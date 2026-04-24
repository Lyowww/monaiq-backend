declare class UserSettingsDto {
    lowBalanceThresholdMinor?: number;
    notificationPayments?: boolean;
    notificationDebts?: boolean;
    notificationLowBalance?: boolean;
    notificationUnusualSpending?: boolean;
    subscription?: 'free' | 'premium';
    subscriptionPlanKey?: string | null;
}
export declare class UpdateUserProfileDto {
    firstName?: string;
    lastName?: string;
    currencyCode?: 'AMD' | 'USD' | 'EUR';
    settings?: UserSettingsDto;
}
export declare class RegisterPushTokenDto {
    token: string;
    pushEnabled?: boolean;
}
export {};
