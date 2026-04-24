import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Transaction, TransactionSchema } from '../transactions/schemas/transaction.schema';
import { ScheduledPayment, ScheduledPaymentSchema } from './schemas/scheduled-payment.schema';
import { ScheduledPaymentsController } from './scheduled-payments.controller';
import { ScheduledPaymentsService } from './scheduled-payments.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ScheduledPayment.name, schema: ScheduledPaymentSchema },
      { name: Transaction.name, schema: TransactionSchema }
    ])
  ],
  controllers: [ScheduledPaymentsController],
  providers: [ScheduledPaymentsService],
  exports: [ScheduledPaymentsService, MongooseModule]
})
export class ScheduledPaymentsModule {}
