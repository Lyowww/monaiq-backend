import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  Allow,
  IsBoolean,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  MinLength,
  ValidateIf,
  ValidateNested
} from 'class-validator';

class UserSettingsDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(0)
  lowBalanceThresholdMinor?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  notificationPayments?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  notificationDebts?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  notificationLowBalance?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  notificationUnusualSpending?: boolean;

  @ApiPropertyOptional({ enum: ['free', 'premium'] })
  @IsOptional()
  @IsIn(['free', 'premium'])
  subscription?: 'free' | 'premium';

  @ApiPropertyOptional({ nullable: true, description: 'Commercial plan key from admin, or null to clear' })
  @Allow()
  @IsOptional()
  @ValidateIf((_, v) => v !== null && v !== undefined)
  @IsString()
  @MaxLength(64)
  subscriptionPlanKey?: string | null;
}

export class UpdateUserProfileDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(80)
  firstName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(80)
  lastName?: string;

  @ApiPropertyOptional({ enum: ['AMD', 'USD', 'EUR'] })
  @IsOptional()
  @IsIn(['AMD', 'USD', 'EUR'])
  currencyCode?: 'AMD' | 'USD' | 'EUR';

  @ApiPropertyOptional()
  @IsOptional()
  @ValidateNested()
  @Type(() => UserSettingsDto)
  settings?: UserSettingsDto;
}

export class RegisterPushTokenDto {
  @ApiProperty({
    description: 'Native device push token (FCM on Android; may be APNs on iOS with Expo alone)'
  })
  @IsString()
  @MinLength(20)
  token!: string;

  @ApiPropertyOptional({ description: 'When set, updates pushNotificationsEnabled on user_preferences' })
  @IsOptional()
  @IsBoolean()
  pushEnabled?: boolean;
}
