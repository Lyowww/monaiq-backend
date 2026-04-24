import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Transaction, TransactionSchema } from '../transactions/schemas/transaction.schema';
import { User, UserSchema } from '../users/schemas/user.schema';
import { AiChatLog, AiChatLogSchema } from '../ai/ai-chat-log.schema';
import { AppHomeItem, AppHomeItemSchema } from './schemas/app-home-item.schema';
import { SubscriptionPlan, SubscriptionPlanSchema } from './schemas/subscription-plan.schema';
import { Debt, DebtSchema } from '../debts/schemas/debt.schema';
import { ScheduledPayment, ScheduledPaymentSchema } from '../scheduled-payments/schemas/scheduled-payment.schema';
import { AppNotification, AppNotificationSchema } from '../app-notifications/schemas/app-notification.schema';
import { FinancialPlan, FinancialPlanSchema } from '../plans/schemas/financial-plan.schema';
import { UserPreference, UserPreferenceSchema } from '../finance-domain/schemas/user-preference.schema';
import { Obligation, ObligationSchema } from '../finance-domain/schemas/obligation.schema';
import { CommunityBenchmark, CommunityBenchmarkSchema } from '../finance-domain/schemas/community-benchmark.schema';
import { AiStructuredArtifact, AiStructuredArtifactSchema } from '../finance-domain/schemas/ai-structured-artifact.schema';
import { ContactLedger, ContactLedgerSchema } from '../finance-domain/schemas/contact-ledger.schema';
import { SavingsGoal, SavingsGoalSchema } from '../finance-domain/schemas/savings-goal.schema';
import { Note, NoteSchema } from '../notes/schemas/note.schema';
import { AuthSession, AuthSessionSchema } from '../auth/schemas/auth-session.schema';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { AppHomeController } from './app-home.controller';
import { AppSubscriptionsController } from './app-subscriptions.controller';
import { SubscriptionPlansService } from './subscription-plans.service';
import { AdminDataService } from './admin-data.service';
import { AdminDataController } from './admin-data.controller';
import { AiModule } from '../ai/ai.module';

@Module({
  imports: [
    AiModule,
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Transaction.name, schema: TransactionSchema },
      { name: Debt.name, schema: DebtSchema },
      { name: ScheduledPayment.name, schema: ScheduledPaymentSchema },
      { name: AiChatLog.name, schema: AiChatLogSchema },
      { name: AppHomeItem.name, schema: AppHomeItemSchema },
      { name: SubscriptionPlan.name, schema: SubscriptionPlanSchema },
      { name: AppNotification.name, schema: AppNotificationSchema },
      { name: FinancialPlan.name, schema: FinancialPlanSchema },
      { name: UserPreference.name, schema: UserPreferenceSchema },
      { name: Obligation.name, schema: ObligationSchema },
      { name: CommunityBenchmark.name, schema: CommunityBenchmarkSchema },
      { name: AiStructuredArtifact.name, schema: AiStructuredArtifactSchema },
      { name: ContactLedger.name, schema: ContactLedgerSchema },
      { name: SavingsGoal.name, schema: SavingsGoalSchema },
      { name: Note.name, schema: NoteSchema },
      { name: AuthSession.name, schema: AuthSessionSchema }
    ])
  ],
  providers: [AdminService, SubscriptionPlansService, AdminDataService],
  controllers: [AdminController, AdminDataController, AppHomeController, AppSubscriptionsController],
  exports: [AdminService, SubscriptionPlansService]
})
export class AdminModule {}
