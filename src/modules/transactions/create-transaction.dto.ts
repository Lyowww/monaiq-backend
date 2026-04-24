import {
  IsBoolean,
  IsDateString,
  IsIn,
  IsInt,
  IsMongoId,
  IsOptional,
  IsString,
  MaxLength,
  Min
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTransactionDto {
  @ApiProperty({ enum: ['manual', 'ocr', 'voice', 'bank_sync', 'suggestion'], example: 'manual' })
  @IsIn(['manual', 'ocr', 'voice', 'bank_sync', 'suggestion'])
  source!: 'manual' | 'ocr' | 'voice' | 'bank_sync' | 'suggestion';

  @ApiProperty({ example: 'food' })
  @IsString()
  @MaxLength(64)
  category!: string;

  @ApiPropertyOptional({ example: 'fast_food' })
  @IsOptional()
  @IsString()
  @MaxLength(64)
  subcategory?: string;

  @ApiProperty({ enum: ['credit', 'debit'], example: 'debit' })
  @IsIn(['credit', 'debit'])
  direction!: 'credit' | 'debit';

  @ApiProperty({ example: 350000 })
  @IsInt()
  @Min(1)
  amountMinor!: number;

  @ApiPropertyOptional({ enum: ['AMD'], example: 'AMD' })
  @IsOptional()
  @IsString()
  currencyCode?: 'AMD';

  @ApiProperty({ example: '2026-04-22T18:10:00.000Z' })
  @IsDateString()
  bookedAt!: string;

  @ApiPropertyOptional({ example: 'KFC' })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  merchantName?: string;

  @ApiPropertyOptional({ example: 'Quick command expense' })
  @IsOptional()
  @IsString()
  @MaxLength(280)
  notes?: string;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  isTransfer?: boolean;

  @ApiPropertyOptional({ example: '6807fa8f0d0c6f8ef1f8f999' })
  @IsOptional()
  @IsMongoId()
  debtId?: string;

  @ApiPropertyOptional({ example: 'kfc 3500' })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  quickCommandRaw?: string;

  @ApiPropertyOptional({ enum: ['salary', 'freelance', 'gift', 'other'] })
  @IsOptional()
  @IsIn(['salary', 'freelance', 'gift', 'other'])
  incomeSource?: 'salary' | 'freelance' | 'gift' | 'other';

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  recurring?: boolean;

  @ApiPropertyOptional({ enum: ['none', 'monthly', 'weekly'] })
  @IsOptional()
  @IsIn(['none', 'monthly', 'weekly'])
  recurrenceType?: 'none' | 'monthly' | 'weekly';

  @ApiPropertyOptional({ enum: ['cash', 'card'], example: 'card' })
  @IsOptional()
  @IsIn(['cash', 'card'])
  pocket?: 'cash' | 'card';
}
