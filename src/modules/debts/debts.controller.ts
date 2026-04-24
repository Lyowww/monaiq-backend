import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import type { AccessTokenClaims } from '../auth/auth.types';
import { mapDebt } from './debt.mappers';
import { CreateDebtDto, UpdateDebtDto } from './debt.dto';
import { DebtsService } from './debts.service';

@ApiTags('Debts')
@ApiBearerAuth('bearer')
@Controller('debts')
@UseGuards(JwtAuthGuard)
export class DebtsController {
  constructor(private readonly debtsService: DebtsService) {}

  @Get()
  @ApiOperation({ summary: 'List debts, optionally by I_OWE / THEY_OWE' })
  list(
    @CurrentUser() claims: AccessTokenClaims,
    @Query('debtType') debtType?: 'I_OWE' | 'THEY_OWE'
  ) {
    return this.debtsService
      .listForUser(claims.sub, debtType)
      .then((rows) => rows.map((d) => mapDebt(d)));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single debt' })
  getOne(@CurrentUser() claims: AccessTokenClaims, @Param('id') id: string) {
    return this.debtsService.getById(claims.sub, id).then((d) => mapDebt(d));
  }

  @Post()
  @ApiOperation({ summary: 'Create a debt' })
  create(@CurrentUser() claims: AccessTokenClaims, @Body() dto: CreateDebtDto) {
    return this.debtsService.create(claims.sub, dto).then((d) => mapDebt(d));
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a debt' })
  update(
    @CurrentUser() claims: AccessTokenClaims,
    @Param('id') id: string,
    @Body() dto: UpdateDebtDto
  ) {
    return this.debtsService.update(claims.sub, id, dto).then((d) => mapDebt(d));
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a debt' })
  remove(@CurrentUser() claims: AccessTokenClaims, @Param('id') id: string) {
    return this.debtsService.remove(claims.sub, id).then(() => ({ success: true as const }));
  }
}
