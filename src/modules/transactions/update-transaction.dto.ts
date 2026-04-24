import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsDateString, IsIn, IsInt, IsOptional, IsString, MaxLength, Min } from 'class-validator';

export class UpdateTransactionDto {
  @ApiPropertyOptional({ enum: ['manual', 'ocr', 'voice', 'bank_sync', 'suggestion'] })
  @IsOptional()
  @IsIn(['manual', 'ocr', 'voice', 'bank_sync', 'suggestion'])
  source?: 'manual' | 'ocr' | 'voice' | 'bank_sync' | 'suggestion';

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(64)
  category?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(64)
  subcategory?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(1)
  amountMinor?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  bookedAt?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(120)
  merchantName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(280)
  notes?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsIn(['salary', 'freelance', 'gift', 'other'])
  incomeSource?: 'salary' | 'freelance' | 'gift' | 'other';

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  recurring?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsIn(['none', 'monthly', 'weekly'])
  recurrenceType?: 'none' | 'monthly' | 'weekly';
}
