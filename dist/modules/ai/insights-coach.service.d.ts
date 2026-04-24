import { ConfigService } from '@nestjs/config';
import { Model } from 'mongoose';
import { Debt } from '../debts/schemas/debt.schema';
import { Note } from '../notes/schemas/note.schema';
import { Transaction } from '../transactions/schemas/transaction.schema';
import { User, UserDocument } from '../users/schemas/user.schema';
export declare class InsightsCoachService {
    private readonly configService;
    private readonly userModel;
    private readonly transactionModel;
    private readonly debtModel;
    private readonly noteModel;
    private readonly logger;
    constructor(configService: ConfigService, userModel: Model<User>, transactionModel: Model<Transaction>, debtModel: Model<Debt>, noteModel: Model<Note>);
    runDailyInsights(): Promise<void>;
    generateDailyInsightForUser(user: UserDocument): Promise<string | null>;
    private calculateCurrentBalanceAllTime;
    private mapNote;
}
