import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { SubscriptionPlansService } from './subscription-plans.service';

@ApiTags('app-subscriptions')
@Controller('app/subscriptions')
export class AppSubscriptionsController {
  constructor(private readonly subscriptionPlans: SubscriptionPlansService) {}

  @Get('plans')
  @ApiOperation({ summary: 'Active subscription plans for the mobile app (public)' })
  plans() {
    return this.subscriptionPlans.listPublicPlans();
  }

  @Get('features')
  @ApiOperation({ summary: 'Feature catalog labels for paywall UI (public)' })
  features() {
    return this.subscriptionPlans.listFeatureCatalog();
  }
}
