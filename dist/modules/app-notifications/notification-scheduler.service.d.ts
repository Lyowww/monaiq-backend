import { Model } from 'mongoose';
import { User, UserDocument } from '../users/schemas/user.schema';
import { Debt } from '../debts/schemas/debt.schema';
import { Transaction } from '../transactions/schemas/transaction.schema';
import { ScheduledPayment } from '../scheduled-payments/schemas/scheduled-payment.schema';
import { AppNotificationsService } from './app-notifications.service';
export declare class NotificationSchedulerService {
    private readonly userModel;
    private readonly debtModel;
    private readonly transactionModel;
    private readonly paymentModel;
    private readonly appNotifications;
    private readonly logger;
    constructor(userModel: Model<User>, debtModel: Model<Debt>, transactionModel: Model<Transaction>, paymentModel: Model<ScheduledPayment>, appNotifications: AppNotificationsService);
    runDailyReminders(): Promise<void>;
    /** Used by internal cron HTTP as well */
    evaluateUser(u: UserDocument): Promise<void>;
    private sumDebitWindow;
}
