import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsDateString, IsIn, IsInt, IsOptional, IsString, MaxLength, Min } from 'class-validator';

export class CreateScheduledPaymentDto {
  @ApiProperty({ example: 'Electricity' })
  @IsString()
  @MaxLength(200)
  title!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;

  @ApiProperty()
  @IsInt()
  @Min(1)
  amountMinor!: number;

  @ApiProperty()
  @IsDateString()
  dueDate!: string;

  @ApiProperty()
  @IsBoolean()
  recurring!: boolean;

  @ApiProperty({ enum: ['none', 'weekly', 'monthly'] })
  @IsIn(['none', 'weekly', 'monthly'])
  recurrenceType!: 'none' | 'weekly' | 'monthly';

  @ApiProperty({ enum: ['utilities', 'subscription', 'rent', 'other'] })
  @IsIn(['utilities', 'subscription', 'rent', 'other'])
  category!: 'utilities' | 'subscription' | 'rent' | 'other';

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  reminderEnabled?: boolean;
}

export class UpdateScheduledPaymentDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(200)
  title?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(1)
  amountMinor?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  recurring?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsIn(['none', 'weekly', 'monthly'])
  recurrenceType?: 'none' | 'weekly' | 'monthly';

  @ApiPropertyOptional()
  @IsOptional()
  @IsIn(['utilities', 'subscription', 'rent', 'other'])
  category?: 'utilities' | 'subscription' | 'rent' | 'other';

  @ApiPropertyOptional()
  @IsOptional()
  @IsIn(['pending', 'paid'])
  status?: 'pending' | 'paid';

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  reminderEnabled?: boolean;
}

export class MarkPaymentPaidDto {
  @ApiPropertyOptional({
    description: 'If omitted, full scheduled amount is posted as an expense'
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  amountMinor?: number;
}
