import { ConfigService } from '@nestjs/config';
import { InsightsCoachService } from './insights-coach.service';
export declare class AiCronController {
    private readonly configService;
    private readonly insightsCoachService;
    constructor(configService: ConfigService, insightsCoachService: InsightsCoachService);
    runDailyInsights(authorization?: string): Promise<{
        success: true;
        triggeredAt: string;
    }>;
}
