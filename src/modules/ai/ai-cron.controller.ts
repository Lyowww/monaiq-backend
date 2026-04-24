import {
  Controller,
  Get,
  Headers,
  ServiceUnavailableException,
  UnauthorizedException
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiExcludeController } from '@nestjs/swagger';
import { InsightsCoachService } from './insights-coach.service';

@ApiExcludeController()
@Controller('internal/cron')
export class AiCronController {
  constructor(
    private readonly configService: ConfigService,
    private readonly insightsCoachService: InsightsCoachService
  ) {}

  @Get('daily-insights')
  async runDailyInsights(
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

    await this.insightsCoachService.runDailyInsights();

    return {
      success: true,
      triggeredAt: new Date().toISOString()
    };
  }
}
