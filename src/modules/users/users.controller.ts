import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Patch,
  Post,
  UseGuards
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiNoContentResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { UserProfileDto } from '../../common/swagger/swagger.models';
import type { AccessTokenClaims } from '../auth/auth.types';
import { toUserProfile } from './schemas/user.schema';
import { RegisterPushTokenDto, UpdateUserProfileDto } from './user.dto';
import { SubscriptionPlansService } from '../admin/subscription-plans.service';
import { UserPreferencesService } from './user-preferences.service';
import { UsersService } from './users.service';

@ApiTags('Users')
@ApiBearerAuth('bearer')
@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly userPreferencesService: UserPreferencesService,
    private readonly subscriptionPlans: SubscriptionPlansService
  ) {}

  @Get('me')
  @ApiOperation({ summary: 'Current user profile and settings' })
  @ApiOkResponse({ type: UserProfileDto })
  async me(@CurrentUser() claims: AccessTokenClaims) {
    const user = await this.usersService.findById(claims.sub);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const entitledFeatureIds = await this.subscriptionPlans.getEntitledFeatureIdsForUser(user);
    return { ...toUserProfile(user, true), entitledFeatureIds };
  }

  @Patch('me')
  @ApiOperation({ summary: 'Update profile and notification preferences' })
  async patchMe(@CurrentUser() claims: AccessTokenClaims, @Body() dto: UpdateUserProfileDto) {
    const user = await this.usersService.updateProfile(claims.sub, dto);
    const entitledFeatureIds = await this.subscriptionPlans.getEntitledFeatureIdsForUser(user);
    return { ...toUserProfile(user, true), entitledFeatureIds };
  }

  @Post('me/push-token')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Register FCM / native device token for push notifications' })
  @ApiBody({ type: RegisterPushTokenDto })
  @ApiNoContentResponse()
  async registerPushToken(
    @CurrentUser() claims: AccessTokenClaims,
    @Body() dto: RegisterPushTokenDto
  ): Promise<void> {
    await this.userPreferencesService.setFcmToken(claims.sub, dto.token, dto.pushEnabled);
  }
}
