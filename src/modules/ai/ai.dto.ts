import { IsIn, IsMongoId, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ReceiptOcrDto {
  @ApiProperty({ example: 'Yerevan City AMD 2450 22/04/2026' })
  @IsString()
  @IsNotEmpty()
  rawText!: string;
}

export class FinanceChatDto {
  @ApiProperty({ example: 'Can I buy headphones for 50,000 dram this week?' })
  @IsString()
  @MinLength(1)
  @MaxLength(4000)
  message!: string;

  /** Continue an existing thread; omit to start a new saved conversation. */
  @ApiProperty({ required: false })
  @IsOptional()
  @IsMongoId()
  conversationId?: string;

  /** Matches app UI: English vs Eastern Armenian assistant replies. */
  @ApiProperty({ required: false, enum: ['en', 'hy'], default: 'en' })
  @IsOptional()
  @IsIn(['en', 'hy'])
  replyLanguage?: 'en' | 'hy';
}

export class OpenRouterChatDto {
  @ApiProperty({ example: 'How many r\'s are in the word "strawberry"?' })
  @IsString()
  @MinLength(1)
  @MaxLength(8000)
  message!: string;

  /** When `hy`, the message is translated to English for the model and the streamed reply is translated back to Armenian. */
  @ApiProperty({ required: false, enum: ['en', 'hy'], default: 'en' })
  @IsOptional()
  @IsIn(['en', 'hy'])
  replyLanguage?: 'en' | 'hy';
}
