import { OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserPreferencesService } from '../users/user-preferences.service';
export declare class FcmService implements OnModuleInit {
    private readonly config;
    private readonly userPreferences;
    private readonly logger;
    private ready;
    constructor(config: ConfigService, userPreferences: UserPreferencesService);
    onModuleInit(): void;
    isEnabled(): boolean;
    /**
     * Sends a display notification via FCM. Android tokens from Expo are FCM registration tokens.
     * iOS tokens from `expo-notifications` are often APNs device tokens; FCM may reject them unless
     * the app uses Firebase iOS SDK for an FCM registration token.
     */
    sendToDevice(userId: string, token: string, title: string, body: string, data?: Record<string, string>): Promise<void>;
}
