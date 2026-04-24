import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Debt, DebtSchema } from '../debts/schemas/debt.schema';
import { Note, NoteSchema } from '../notes/schemas/note.schema';
import { ScheduledPayment, ScheduledPaymentSchema } from '../scheduled-payments/schemas/scheduled-payment.schema';
import { Transaction, TransactionSchema } from '../transactions/schemas/transaction.schema';
import { UsersModule } from '../users/users.module';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';

@Module({
  imports: [
    UsersModule,
    MongooseModule.forFeature([
      { name: Transaction.name, schema: TransactionSchema },
      { name: Debt.name, schema: DebtSchema },
      { name: Note.name, schema: NoteSchema },
      { name: ScheduledPayment.name, schema: ScheduledPaymentSchema }
    ])
  ],
  controllers: [DashboardController],
  providers: [DashboardService]
})
export class DashboardModule {}
