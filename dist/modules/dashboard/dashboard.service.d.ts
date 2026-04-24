import type { DashboardSummary } from '@ai-finance/shared-types';
import { Model } from 'mongoose';
import { Debt } from '../debts/schemas/debt.schema';
import { ScheduledPayment } from '../scheduled-payments/schemas/scheduled-payment.schema';
import { Note } from '../notes/schemas/note.schema';
import { Transaction } from '../transactions/schemas/transaction.schema';
import { UsersService } from '../users/users.service';
export declare class DashboardService {
    private readonly usersService;
    private readonly transactionModel;
    private readonly debtModel;
    private readonly noteModel;
    private readonly paymentModel;
    constructor(usersService: UsersService, transactionModel: Model<Transaction>, debtModel: Model<Debt>, noteModel: Model<Note>, paymentModel: Model<ScheduledPayment>);
    getSummary(userId: string): Promise<DashboardSummary>;
    private buildAutoInsights;
    private aggregateTopMerchants;
    private aggregateCategorySpend;
    private aggregatePocketNets;
    private aggregateTotals;
    private pickTotal;
    private buildAiWarnings;
    private calculateDebtPressureScore;
}
