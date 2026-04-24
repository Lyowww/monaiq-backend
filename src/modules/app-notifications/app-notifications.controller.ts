import { Controller, Get, Param, Patch, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import type { AccessTokenClaims } from '../auth/auth.types';
import { AppNotificationsService } from './app-notifications.service';

@ApiTags('Notifications')
@ApiBearerAuth('bearer')
@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class AppNotificationsController {
  constructor(private readonly notificationsService: AppNotificationsService) {}

  @Get()
  @ApiOperation({ summary: 'In-app notification feed' })
  list(
    @CurrentUser() claims: AccessTokenClaims,
    @Query('unreadOnly') unreadOnly?: string
  ) {
    return this.notificationsService
      .listForUser(claims.sub, unreadOnly === 'true' || unreadOnly === '1')
      .then((rows) => rows.map((n) => this.notificationsService.map(n)));
  }

  @Patch(':id/read')
  markRead(@CurrentUser() claims: AccessTokenClaims, @Param('id') id: string) {
    return this.notificationsService
      .markRead(claims.sub, id)
      .then((n) => this.notificationsService.map(n));
  }
}
