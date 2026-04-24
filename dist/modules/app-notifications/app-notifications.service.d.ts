import { Model } from 'mongoose';
import type { AppNotificationRecord } from '@ai-finance/shared-types';
import { UserPreferencesService } from '../users/user-preferences.service';
import { AppNotification, AppNotificationDocument } from './schemas/app-notification.schema';
import { FcmService } from './fcm.service';
export declare class AppNotificationsService {
    private readonly notificationModel;
    private readonly userPreferences;
    private readonly fcm;
    constructor(notificationModel: Model<AppNotification>, userPreferences: UserPreferencesService, fcm: FcmService);
    map(n: AppNotificationDocument): AppNotificationRecord;
    listForUser(userId: string, unreadOnly?: boolean): Promise<AppNotificationDocument[]>;
    markRead(userId: string, id: string): Promise<AppNotificationDocument>;
    createIfNew(userId: string, payload: {
        type: AppNotification['type'];
        title: string;
        message: string;
        scheduledAt: Date;
    }): Promise<AppNotificationDocument | null>;
}
