import { type FinanceAssistantReplyLanguage } from '@ai-finance/shared-types';
import { Model } from 'mongoose';
import { Debt } from '../debts/schemas/debt.schema';
import { ScheduledPayment } from '../scheduled-payments/schemas/scheduled-payment.schema';
import { Transaction } from '../transactions/schemas/transaction.schema';
import { User } from '../users/schemas/user.schema';
import { OpenRouterLlmService } from './openrouter-llm.service';
import { PlansService } from '../plans/plans.service';
import { TranslationService } from './translation.service';
export declare class FinanceAssistantService {
    private readonly openRouter;
    private readonly translation;
    private readonly plansService;
    private readonly transactionModel;
    private readonly debtModel;
    private readonly paymentModel;
    private readonly userModel;
    private readonly logger;
    constructor(openRouter: OpenRouterLlmService, translation: TranslationService, plansService: PlansService, transactionModel: Model<Transaction>, debtModel: Model<Debt>, paymentModel: Model<ScheduledPayment>, userModel: Model<User>);
    answer(userId: string, message: string, replyLanguage: FinanceAssistantReplyLanguage, options?: {
        priorMessages?: {
            role: 'user' | 'assistant';
            content: string;
        }[];
    }): Promise<string>;
    private buildContext;
}
