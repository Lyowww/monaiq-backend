import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UserProfileDto {
  @ApiProperty({ example: '6807fa8f0d0c6f8ef1f8f123' })
  id!: string;

  @ApiProperty({ example: 'user@example.com' })
  email!: string;

  @ApiProperty({ example: 'Lilit' })
  firstName!: string;

  @ApiProperty({ example: 'Hakobyan' })
  lastName!: string;

  @ApiProperty({ enum: ['AMD', 'USD', 'EUR'], example: 'AMD' })
  currencyCode!: 'AMD' | 'USD' | 'EUR';

  @ApiProperty({ example: 'hy-AM' })
  locale!: string;

  @ApiProperty({ example: '2000-05-12T00:00:00.000Z' })
  dateOfBirth!: string;

  @ApiProperty({ example: false })
  isEmailVerified!: boolean;
}

export class AuthSessionResponseDto {
  @ApiProperty({ type: UserProfileDto })
  user!: UserProfileDto;

  @ApiProperty()
  accessToken!: string;

  @ApiProperty()
  refreshToken!: string;

  @ApiProperty({ example: '2026-04-22T18:10:00.000Z' })
  accessTokenExpiresAt!: string;

  @ApiProperty({ example: '2026-05-22T18:10:00.000Z' })
  refreshTokenExpiresAt!: string;
}

export class SuccessResponseDto {
  @ApiProperty({ example: true })
  success!: true;
}

export class TransactionRecordDto {
  @ApiProperty({ example: '6807fa8f0d0c6f8ef1f8f124' })
  id!: string;

  @ApiProperty({ example: '6807fa8f0d0c6f8ef1f8f123' })
  userId!: string;

  @ApiPropertyOptional({ example: '6807fa8f0d0c6f8ef1f8f999' })
  debtId?: string;

  @ApiProperty({ enum: ['manual', 'ocr', 'voice', 'bank_sync'], example: 'manual' })
  source!: 'manual' | 'ocr' | 'voice' | 'bank_sync';

  @ApiProperty({ example: 'food' })
  category!: string;

  @ApiProperty({ enum: ['credit', 'debit'], example: 'debit' })
  direction!: 'credit' | 'debit';

  @ApiProperty({ example: 350000 })
  amountMinor!: number;

  @ApiProperty({ enum: ['AMD', 'USD', 'EUR'], example: 'AMD' })
  currencyCode!: 'AMD' | 'USD' | 'EUR';

  @ApiProperty({ example: '2026-04-22T18:10:00.000Z' })
  bookedAt!: string;

  @ApiPropertyOptional({ example: 'KFC' })
  merchantName?: string;

  @ApiPropertyOptional({ example: 'Voice quick action' })
  notes?: string;

  @ApiProperty({ example: false })
  isTransfer!: boolean;

  @ApiPropertyOptional({ enum: ['cash', 'card'], example: 'card' })
  pocket?: 'cash' | 'card';
}

export class TransactionResponseDto extends TransactionRecordDto {
  @ApiPropertyOptional({ example: 'kfc 3500' })
  quickCommandRaw?: string;
}

export class AiWarningDto {
  @ApiProperty({ example: '6807fa8f0d0c6f8ef1f8f125' })
  noteId!: string;

  @ApiProperty({ example: 'Rent payment' })
  title!: string;

  @ApiProperty({ example: '2026-05-01T00:00:00.000Z' })
  dueDate!: string;

  @ApiProperty({ example: 1800000 })
  projectedBalanceMinor!: number;

  @ApiProperty({ example: 2500000 })
  totalObligationMinor!: number;

  @ApiProperty({ enum: ['medium', 'high', 'critical'], example: 'high' })
  severity!: 'medium' | 'high' | 'critical';

  @ApiProperty({
    example: 'Projected balance is short by 700000 AMD minor units before Rent payment becomes due.'
  })
  message!: string;
}

export class DashboardSummaryDto {
  @ApiProperty({ enum: ['AMD', 'USD', 'EUR'], example: 'AMD' })
  currencyCode!: 'AMD' | 'USD' | 'EUR';

  @ApiProperty({ example: 4500000 })
  liquidBalanceMinor!: number;

  @ApiProperty({ example: 3200000 })
  cardBalanceMinor!: number;

  @ApiProperty({ example: 1300000 })
  cashOnHandMinor!: number;

  @ApiProperty({ example: 1200000 })
  monthlyInflowMinor!: number;

  @ApiProperty({ example: 470000 })
  monthlyOutflowMinor!: number;

  @ApiProperty({ example: 980000 })
  obligationDueMinor!: number;

  @ApiProperty({ example: 64 })
  debtPressureScore!: number;

  @ApiProperty({ type: [TransactionRecordDto] })
  recentTransactions!: TransactionRecordDto[];

  @ApiProperty({ type: [AiWarningDto] })
  aiWarnings!: AiWarningDto[];

  @ApiPropertyOptional({ example: '2026-04-22T06:00:00.000Z' })
  lastInsightAt?: string;
}

export class ReceiptOcrResponseDto {
  @ApiProperty({ example: 'Yerevan City' })
  merchantName!: string;

  @ApiProperty({ example: '2026-04-22T00:00:00.000Z' })
  bookedAtIso!: string;

  @ApiProperty({ example: 245000 })
  amountMinor!: number;

  @ApiProperty({ enum: ['AMD', 'USD', 'EUR'], example: 'AMD' })
  currencyCode!: 'AMD' | 'USD' | 'EUR';

  @ApiProperty({ example: 'general' })
  category!: string;

  @ApiProperty({ example: 0.82 })
  confidence!: number;

  @ApiProperty({ example: 'Yerevan City AMD 2450 22/04/2026' })
  rawText!: string;
}

export class TranscriptResponseDto {
  @ApiProperty({ example: 'kfc 3500' })
  transcript!: string;
}
