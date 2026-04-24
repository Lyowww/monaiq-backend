import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AdminGuard } from '../../common/guards/admin.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import type { AccessTokenClaims } from '../auth/auth.types';
import { AdminService } from './admin.service';
import { SubscriptionPlansService } from './subscription-plans.service';

@ApiTags('admin')
@ApiBearerAuth('bearer')
@Controller('admin')
@UseGuards(JwtAuthGuard, AdminGuard)
export class AdminController {
  constructor(
    private readonly admin: AdminService,
    private readonly subscriptionPlans: SubscriptionPlansService
  ) {}

  @Get('summary')
  @ApiOperation({ summary: 'High-level app metrics' })
  summary() {
    return this.admin.dashboardSummary();
  }

  @Get('ai-logs')
  @ApiOperation({ summary: 'Recent user prompts to the finance assistant' })
  aiLogs(@Query('limit') limit = '50') {
    return this.admin.listAiLogs(Number(limit) || 50);
  }

  @Get('home-items')
  @ApiOperation({ summary: 'Home / services rows (raw DB, admin only)' })
  listHome() {
    return this.admin.adminListHome();
  }

  @Post('home-items')
  createHome(
    @CurrentUser() _claims: AccessTokenClaims,
    @Body()
    body: {
      key: string;
      titleHy: string;
      titleEn: string;
      subtitleHy: string;
      subtitleEn: string;
      route: string;
      iconName?: string;
      sortOrder?: number;
      enabled?: boolean;
    }
  ) {
    return this.admin.createHomeItem(body);
  }

  @Patch('home-items/:id')
  patchHome(
    @Param('id') id: string,
    @Body()
    body: {
      titleHy?: string;
      titleEn?: string;
      subtitleHy?: string;
      subtitleEn?: string;
      route?: string;
      iconName?: string;
      sortOrder?: number;
      enabled?: boolean;
    }
  ) {
    return this.admin.patchHomeItem(id, body);
  }

  @Delete('home-items/:id')
  deleteHome(@Param('id') id: string) {
    return this.admin.deleteHomeItem(id);
  }

  @Get('subscription-features')
  @ApiOperation({ summary: 'Catalog of feature flags available for subscription plans' })
  subscriptionFeatures() {
    return this.subscriptionPlans.listFeatureCatalog();
  }

  @Get('subscription-plans')
  @ApiOperation({ summary: 'List configured subscription plans' })
  listSubscriptionPlans() {
    return this.subscriptionPlans.listPlans();
  }

  @Post('subscription-plans')
  @ApiOperation({ summary: 'Create a subscription plan' })
  createSubscriptionPlan(
    @Body()
    body: {
      key: string;
      name: string;
      description?: string;
      priceMinor: number;
      currencyCode: 'AMD' | 'USD' | 'EUR';
      billingPeriod: 'month' | 'year';
      featureIds: string[];
      sortOrder?: number;
      isActive?: boolean;
      highlightTag?: string;
    }
  ) {
    return this.subscriptionPlans.createPlan(body);
  }

  @Patch('subscription-plans/:id')
  @ApiOperation({ summary: 'Update a subscription plan' })
  patchSubscriptionPlan(
    @Param('id') id: string,
    @Body()
    body: Partial<{
      name: string;
      description: string | null;
      priceMinor: number;
      currencyCode: 'AMD' | 'USD' | 'EUR';
      billingPeriod: 'month' | 'year';
      featureIds: string[];
      sortOrder: number;
      isActive: boolean;
      highlightTag: string | null;
    }>
  ) {
    return this.subscriptionPlans.patchPlan(id, body);
  }

  @Delete('subscription-plans/:id')
  @ApiOperation({ summary: 'Delete a subscription plan' })
  deleteSubscriptionPlan(@Param('id') id: string) {
    return this.subscriptionPlans.deletePlan(id);
  }
}
