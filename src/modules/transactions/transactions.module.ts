import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Debt, DebtSchema } from '../debts/schemas/debt.schema';
import { TransactionsController } from './transactions.controller';
import { Transaction, TransactionSchema } from './schemas/transaction.schema';
import { TransactionsService } from './transactions.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Transaction.name, schema: TransactionSchema },
      { name: Debt.name, schema: DebtSchema }
    ])
  ],
  controllers: [TransactionsController],
  providers: [TransactionsService],
  exports: [TransactionsService, MongooseModule]
})
export class TransactionsModule {}
