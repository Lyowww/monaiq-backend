import type { Model } from 'mongoose';
import { type UserDocument } from '../users/schemas/user.schema';
import { type TransactionDocument } from '../transactions/schemas/transaction.schema';
import { type DebtDocument } from '../debts/schemas/debt.schema';
import { type ScheduledPaymentDocument } from '../scheduled-payments/schemas/scheduled-payment.schema';
import { type AiChatLogDocument } from '../ai/ai-chat-log.schema';
import { type AppHomeItemDocument } from './schemas/app-home-item.schema';
import { type SubscriptionPlanDocument } from './schemas/subscription-plan.schema';
import { type AppNotificationDocument } from '../app-notifications/schemas/app-notification.schema';
import { type FinancialPlanDocument } from '../plans/schemas/financial-plan.schema';
import { type UserPreferenceDocument } from '../finance-domain/schemas/user-preference.schema';
import { type ObligationDocument } from '../finance-domain/schemas/obligation.schema';
import { type CommunityBenchmarkDocument } from '../finance-domain/schemas/community-benchmark.schema';
import { type AiStructuredArtifactDocument } from '../finance-domain/schemas/ai-structured-artifact.schema';
import { type ContactLedgerDocument } from '../finance-domain/schemas/contact-ledger.schema';
import { type SavingsGoalDocument } from '../finance-domain/schemas/savings-goal.schema';
import { type NoteDocument } from '../notes/schemas/note.schema';
import { type AuthSessionDocument } from '../auth/schemas/auth-session.schema';
export type AdminCollectionMeta = {
    key: string;
    label: string;
    defaultSort: {
        field: string;
        direction: 1 | -1;
    };
};
export declare class AdminDataService {
    private readonly registry;
    constructor(userModel: Model<UserDocument>, transactionModel: Model<TransactionDocument>, debtModel: Model<DebtDocument>, scheduledPaymentModel: Model<ScheduledPaymentDocument>, aiChatLogModel: Model<AiChatLogDocument>, appHomeItemModel: Model<AppHomeItemDocument>, subscriptionPlanModel: Model<SubscriptionPlanDocument>, appNotificationModel: Model<AppNotificationDocument>, financialPlanModel: Model<FinancialPlanDocument>, userPreferenceModel: Model<UserPreferenceDocument>, obligationModel: Model<ObligationDocument>, communityBenchmarkModel: Model<CommunityBenchmarkDocument>, aiStructuredArtifactModel: Model<AiStructuredArtifactDocument>, contactLedgerModel: Model<ContactLedgerDocument>, savingsGoalModel: Model<SavingsGoalDocument>, noteModel: Model<NoteDocument>, authSessionModel: Model<AuthSessionDocument>);
    listCollectionMeta(): {
        collections: AdminCollectionMeta[];
    };
    private resolve;
    private parseObjectId;
    listDocuments(collectionKey: string, opts: {
        page: number;
        pageSize: number;
    }): Promise<{
        collection: string;
        page: number;
        pageSize: number;
        total: number;
        items: unknown[];
    }>;
    getDocument(collectionKey: string, id: string): Promise<unknown>;
    createDocument(collectionKey: string, body: Record<string, unknown>): Promise<unknown>;
    patchDocument(collectionKey: string, id: string, body: Record<string, unknown>): Promise<unknown>;
    deleteDocument(collectionKey: string, id: string): Promise<{
        success: true;
    }>;
}
