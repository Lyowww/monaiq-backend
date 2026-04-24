"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const transaction_schema_1 = require("../transactions/schemas/transaction.schema");
const user_schema_1 = require("../users/schemas/user.schema");
const ai_chat_log_schema_1 = require("../ai/ai-chat-log.schema");
const app_home_item_schema_1 = require("./schemas/app-home-item.schema");
const subscription_plan_schema_1 = require("./schemas/subscription-plan.schema");
const debt_schema_1 = require("../debts/schemas/debt.schema");
const scheduled_payment_schema_1 = require("../scheduled-payments/schemas/scheduled-payment.schema");
const app_notification_schema_1 = require("../app-notifications/schemas/app-notification.schema");
const financial_plan_schema_1 = require("../plans/schemas/financial-plan.schema");
const user_preference_schema_1 = require("../finance-domain/schemas/user-preference.schema");
const obligation_schema_1 = require("../finance-domain/schemas/obligation.schema");
const community_benchmark_schema_1 = require("../finance-domain/schemas/community-benchmark.schema");
const ai_structured_artifact_schema_1 = require("../finance-domain/schemas/ai-structured-artifact.schema");
const contact_ledger_schema_1 = require("../finance-domain/schemas/contact-ledger.schema");
const savings_goal_schema_1 = require("../finance-domain/schemas/savings-goal.schema");
const note_schema_1 = require("../notes/schemas/note.schema");
const auth_session_schema_1 = require("../auth/schemas/auth-session.schema");
const admin_service_1 = require("./admin.service");
const admin_controller_1 = require("./admin.controller");
const app_home_controller_1 = require("./app-home.controller");
const app_subscriptions_controller_1 = require("./app-subscriptions.controller");
const subscription_plans_service_1 = require("./subscription-plans.service");
const admin_data_service_1 = require("./admin-data.service");
const admin_data_controller_1 = require("./admin-data.controller");
const ai_module_1 = require("../ai/ai.module");
let AdminModule = class AdminModule {
};
exports.AdminModule = AdminModule;
exports.AdminModule = AdminModule = __decorate([
    (0, common_1.Module)({
        imports: [
            ai_module_1.AiModule,
            mongoose_1.MongooseModule.forFeature([
                { name: user_schema_1.User.name, schema: user_schema_1.UserSchema },
                { name: transaction_schema_1.Transaction.name, schema: transaction_schema_1.TransactionSchema },
                { name: debt_schema_1.Debt.name, schema: debt_schema_1.DebtSchema },
                { name: scheduled_payment_schema_1.ScheduledPayment.name, schema: scheduled_payment_schema_1.ScheduledPaymentSchema },
                { name: ai_chat_log_schema_1.AiChatLog.name, schema: ai_chat_log_schema_1.AiChatLogSchema },
                { name: app_home_item_schema_1.AppHomeItem.name, schema: app_home_item_schema_1.AppHomeItemSchema },
                { name: subscription_plan_schema_1.SubscriptionPlan.name, schema: subscription_plan_schema_1.SubscriptionPlanSchema },
                { name: app_notification_schema_1.AppNotification.name, schema: app_notification_schema_1.AppNotificationSchema },
                { name: financial_plan_schema_1.FinancialPlan.name, schema: financial_plan_schema_1.FinancialPlanSchema },
                { name: user_preference_schema_1.UserPreference.name, schema: user_preference_schema_1.UserPreferenceSchema },
                { name: obligation_schema_1.Obligation.name, schema: obligation_schema_1.ObligationSchema },
                { name: community_benchmark_schema_1.CommunityBenchmark.name, schema: community_benchmark_schema_1.CommunityBenchmarkSchema },
                { name: ai_structured_artifact_schema_1.AiStructuredArtifact.name, schema: ai_structured_artifact_schema_1.AiStructuredArtifactSchema },
                { name: contact_ledger_schema_1.ContactLedger.name, schema: contact_ledger_schema_1.ContactLedgerSchema },
                { name: savings_goal_schema_1.SavingsGoal.name, schema: savings_goal_schema_1.SavingsGoalSchema },
                { name: note_schema_1.Note.name, schema: note_schema_1.NoteSchema },
                { name: auth_session_schema_1.AuthSession.name, schema: auth_session_schema_1.AuthSessionSchema }
            ])
        ],
        providers: [admin_service_1.AdminService, subscription_plans_service_1.SubscriptionPlansService, admin_data_service_1.AdminDataService],
        controllers: [admin_controller_1.AdminController, admin_data_controller_1.AdminDataController, app_home_controller_1.AppHomeController, app_subscriptions_controller_1.AppSubscriptionsController],
        exports: [admin_service_1.AdminService, subscription_plans_service_1.SubscriptionPlansService]
    })
], AdminModule);
//# sourceMappingURL=admin.module.js.map