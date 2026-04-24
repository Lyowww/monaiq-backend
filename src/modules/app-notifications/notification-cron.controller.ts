import {
  Controller,
  Get,
  Headers,
  ServiceUnavailableException,
  UnauthorizedException
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiExcludeController } from '@nestjs/swagger';
import { NotificationSchedulerService } from './notification-scheduler.service';

@ApiExcludeController()
@Controller('internal/cron')
export class NotificationCronController {
  constructor(
    private readonly configService: ConfigService,
    private readonly notificationSchedulerService: NotificationSchedulerService
  ) {}

  @Get('notifications')
  async run(
    @Headers('authorization') authorization?: string
  ): Promise<{ success: true; triggeredAt: string }> {
    const cronSecret = this.configService.get<string>('CRON_SECRET');

    if (process.env.NODE_ENV === 'production' && !cronSecret) {
      throw new ServiceUnavailableException(
        'CRON_SECRET must be configured for production cron execution'
      );
    }

    if (cronSecret && authorization !== `Bearer ${cronSecret}`) {
      throw new UnauthorizedException('Invalid cron secret');
    }

    await this.notificationSchedulerService.runDailyReminders();
    return {
      success: true,
      triggeredAt: new Date().toISOString()
    };
  }
}
