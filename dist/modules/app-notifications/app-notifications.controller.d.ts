import type { AccessTokenClaims } from '../auth/auth.types';
import { AppNotificationsService } from './app-notifications.service';
export declare class AppNotificationsController {
    private readonly notificationsService;
    constructor(notificationsService: AppNotificationsService);
    list(claims: AccessTokenClaims, unreadOnly?: string): Promise<import("@ai-finance/shared-types").AppNotificationRecord[]>;
    markRead(claims: AccessTokenClaims, id: string): Promise<import("@ai-finance/shared-types").AppNotificationRecord>;
}
