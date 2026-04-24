import { ConfigService } from '@nestjs/config';
import { NotificationSchedulerService } from './notification-scheduler.service';
export declare class NotificationCronController {
    private readonly configService;
    private readonly notificationSchedulerService;
    constructor(configService: ConfigService, notificationSchedulerService: NotificationSchedulerService);
    run(authorization?: string): Promise<{
        success: true;
        triggeredAt: string;
    }>;
}
