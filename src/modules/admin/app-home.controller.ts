import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import type { AccessTokenClaims } from '../auth/auth.types';
import { AdminService } from './admin.service';

/** Authenticated users — resolved list for clients (DB + built-in fallbacks) */
@ApiTags('app-home')
@ApiBearerAuth('bearer')
@Controller('app-home')
@UseGuards(JwtAuthGuard)
export class AppHomeController {
  constructor(private readonly admin: AdminService) {}

  @Get('items')
  @ApiOperation({ summary: 'Services / shortcuts to show in the app home area' })
  items(@CurrentUser() _user: AccessTokenClaims) {
    return this.admin.listHomeItemsResolved();
  }
}
