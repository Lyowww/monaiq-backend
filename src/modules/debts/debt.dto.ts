import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  Min
} from 'class-validator';

export class CreateDebtDto {
  @ApiProperty({ example: 'Ashot' })
  @IsString()
  @MaxLength(120)
  personName!: string;

  @ApiPropertyOptional({ example: 'I_OWE' })
  @IsOptional()
  @IsIn(['I_OWE', 'THEY_OWE'])
  debtType?: 'I_OWE' | 'THEY_OWE';

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(500)
  reason?: string;

  @ApiProperty({ example: 50_000_00 })
  @IsInt()
  @Min(1)
  principalMinor!: number;

  @ApiPropertyOptional({ example: 50_000_00 })
  @IsOptional()
  @IsInt()
  @Min(0)
  outstandingMinor?: number;

  @ApiProperty({ example: 5_000_00 })
  @IsInt()
  @Min(0)
  minimumDueMinor!: number;

  @ApiProperty({ example: 0 })
  @IsInt()
  @Min(0)
  aprPercent!: number;

  @ApiProperty()
  @IsDateString()
  dueDate!: string;

  @ApiProperty({ enum: ['family', 'friend', 'bank', 'fintech', 'other'] })
  @IsIn(['family', 'friend', 'bank', 'fintech', 'other'])
  relationship!: 'family' | 'friend' | 'bank' | 'fintech' | 'other';

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  reminderEnabled?: boolean;
}

export class UpdateDebtDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(120)
  personName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(120)
  lenderName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsIn(['I_OWE', 'THEY_OWE'])
  debtType?: 'I_OWE' | 'THEY_OWE';

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(500)
  reason?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(1)
  principalMinor?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(0)
  outstandingMinor?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(0)
  minimumDueMinor?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(0)
  aprPercent?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsIn(['family', 'friend', 'bank', 'fintech', 'other'])
  relationship?: 'family' | 'friend' | 'bank' | 'fintech' | 'other';

  @ApiPropertyOptional()
  @IsOptional()
  @IsIn(['active', 'settled', 'defaulted'])
  status?: 'active' | 'settled' | 'defaulted';

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  reminderEnabled?: boolean;
}
