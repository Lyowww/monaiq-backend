import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import type { AccessTokenClaims } from '../auth/auth.types';
import {
  CreateScheduledPaymentDto,
  MarkPaymentPaidDto,
  UpdateScheduledPaymentDto
} from './payment.dto';
import { mapScheduledPayment } from './scheduled-mappers';
import { ScheduledPaymentsService } from './scheduled-payments.service';

@ApiTags('Scheduled payments')
@ApiBearerAuth('bearer')
@Controller('scheduled-payments')
@UseGuards(JwtAuthGuard)
export class ScheduledPaymentsController {
  constructor(private readonly scheduledPaymentsService: ScheduledPaymentsService) {}

  @Get()
  @ApiOperation({ summary: 'List all scheduled / recurring payments' })
  list(@CurrentUser() claims: AccessTokenClaims) {
    return this.scheduledPaymentsService
      .listForUser(claims.sub)
      .then((rows) => rows.map((p) => mapScheduledPayment(p)));
  }

  @Get(':id')
  getOne(@CurrentUser() claims: AccessTokenClaims, @Param('id') id: string) {
    return this.scheduledPaymentsService
      .getById(claims.sub, id)
      .then((p) => mapScheduledPayment(p));
  }

  @Post()
  create(@CurrentUser() claims: AccessTokenClaims, @Body() dto: CreateScheduledPaymentDto) {
    return this.scheduledPaymentsService
      .create(claims.sub, dto)
      .then((p) => mapScheduledPayment(p));
  }

  @Put(':id')
  update(
    @CurrentUser() claims: AccessTokenClaims,
    @Param('id') id: string,
    @Body() dto: UpdateScheduledPaymentDto
  ) {
    return this.scheduledPaymentsService
      .update(claims.sub, id, dto)
      .then((p) => mapScheduledPayment(p));
  }

  @Post(':id/mark-paid')
  @ApiOperation({ summary: 'Record expense, advance recurring if applicable' })
  markPaid(
    @CurrentUser() claims: AccessTokenClaims,
    @Param('id') id: string,
    @Body() dto: MarkPaymentPaidDto
  ) {
    return this.scheduledPaymentsService
      .markPaid(claims.sub, id, dto)
      .then((p) => mapScheduledPayment(p));
  }

  @Delete(':id')
  remove(@CurrentUser() claims: AccessTokenClaims, @Param('id') id: string) {
    return this.scheduledPaymentsService.remove(claims.sub, id).then(() => ({ success: true as const }));
  }
}
