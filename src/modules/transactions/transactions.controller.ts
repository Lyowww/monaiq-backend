import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags
} from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { TransactionResponseDto } from '../../common/swagger/swagger.models';
import type { AccessTokenClaims } from '../auth/auth.types';
import { CreateTransactionDto } from './create-transaction.dto';
import { mapTransaction } from './transaction.mappers';
import { TransactionsService } from './transactions.service';
import { UpdateTransactionDto } from './update-transaction.dto';

@ApiTags('Transactions')
@ApiBearerAuth('bearer')
@Controller('transactions')
@UseGuards(JwtAuthGuard)
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Get()
  @ApiOperation({ summary: 'List transactions (history) with optional filters' })
  list(
    @CurrentUser() claims: AccessTokenClaims,
    @Query('type') type?: 'expense' | 'income',
    @Query('category') category?: string,
    @Query('q') q?: string,
    @Query('limit') limit = '50',
    @Query('skip') skip = '0'
  ) {
    return this.transactionsService
      .listFiltered(claims.sub, {
        type,
        category,
        q,
        limit: Math.min(200, Math.max(1, Number(limit) || 50)),
        skip: Math.max(0, Number(skip) || 0)
      })
      .then((rows) => rows.map((r) => mapTransaction(r)));
  }

  @Post()
  @ApiOperation({ summary: 'Create a new transaction and atomically update linked debt' })
  @ApiCreatedResponse({ type: TransactionResponseDto })
  create(
    @CurrentUser() claims: AccessTokenClaims,
    @Body() dto: CreateTransactionDto
  ) {
    return this.transactionsService.createTransaction(claims.sub, dto).then((r) => mapTransaction(r));
  }

  @Patch(':id')
  update(
    @CurrentUser() claims: AccessTokenClaims,
    @Param('id') id: string,
    @Body() dto: UpdateTransactionDto
  ) {
    return this.transactionsService.updateTransaction(claims.sub, id, dto).then((r) => mapTransaction(r));
  }

  @Delete(':id')
  remove(@CurrentUser() claims: AccessTokenClaims, @Param('id') id: string) {
    return this.transactionsService.deleteTransaction(claims.sub, id).then(() => ({ success: true as const }));
  }
}
