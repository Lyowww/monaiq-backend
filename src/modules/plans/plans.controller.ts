import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import type { AccessTokenClaims } from '../auth/auth.types';
import { CreateFinancialPlanDto, UpdateFinancialPlanDto } from './plan.dto';
import { PlansService } from './plans.service';

@ApiTags('Plans')
@ApiBearerAuth('bearer')
@Controller('plans')
@UseGuards(JwtAuthGuard)
export class PlansController {
  constructor(private readonly plansService: PlansService) {}

  @Get()
  @ApiOperation({ summary: 'List financial plans' })
  list(
    @CurrentUser() claims: AccessTokenClaims,
    @Query('status') status?: 'active' | 'archived'
  ) {
    return this.plansService.listForUser(claims.sub, status);
  }

  @Post()
  @ApiOperation({ summary: 'Create a plan' })
  create(@CurrentUser() claims: AccessTokenClaims, @Body() dto: CreateFinancialPlanDto) {
    return this.plansService.create(claims.sub, dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a plan' })
  update(
    @CurrentUser() claims: AccessTokenClaims,
    @Param('id') id: string,
    @Body() dto: UpdateFinancialPlanDto
  ) {
    return this.plansService.update(claims.sub, id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a plan' })
  remove(@CurrentUser() claims: AccessTokenClaims, @Param('id') id: string) {
    return this.plansService.remove(claims.sub, id);
  }
}
