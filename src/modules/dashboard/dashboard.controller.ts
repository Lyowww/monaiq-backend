import { Controller, Get, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags
} from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { DashboardSummaryDto } from '../../common/swagger/swagger.models';
import { DashboardService } from './dashboard.service';
import type { AccessTokenClaims } from '../auth/auth.types';

@ApiTags('Dashboard')
@ApiBearerAuth('bearer')
@Controller('dashboard')
@UseGuards(JwtAuthGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('summary')
  @ApiOperation({ summary: 'Return the dashboard aggregate summary' })
  @ApiOkResponse({ type: DashboardSummaryDto })
  summary(@CurrentUser() claims: AccessTokenClaims) {
    return this.dashboardService.getSummary(claims.sub);
  }
}
