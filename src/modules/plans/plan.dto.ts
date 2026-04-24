import { IsEnum, IsInt, IsOptional, IsString, Max, MaxLength, Min, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateFinancialPlanDto {
  @ApiProperty({ example: 'Keep food under 80k / month' })
  @IsString()
  @MinLength(2)
  @MaxLength(120)
  title!: string;

  @ApiProperty({ enum: ['monthly_spend_cap', 'category_spend_cap', 'savings_target'] })
  @IsEnum(['monthly_spend_cap', 'category_spend_cap', 'savings_target'])
  planType!: 'monthly_spend_cap' | 'category_spend_cap' | 'savings_target';

  @ApiPropertyOptional({ description: 'Minor units — spend caps' })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(1_000_000_000_000)
  capMinor?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(64)
  category?: string;

  @ApiPropertyOptional({ description: 'Savings goal in minor units' })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(1_000_000_000_000)
  targetMinor?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(1_000_000_000_000)
  savedMinor?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(500)
  notes?: string;
}

export class UpdateFinancialPlanDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(120)
  title?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(1_000_000_000_000)
  capMinor?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(64)
  category?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(1_000_000_000_000)
  targetMinor?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(1_000_000_000_000)
  savedMinor?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(500)
  notes?: string;

  @ApiPropertyOptional({ enum: ['active', 'archived'] })
  @IsOptional()
  @IsEnum(['active', 'archived'])
  status?: 'active' | 'archived';
}
