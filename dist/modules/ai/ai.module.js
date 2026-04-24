"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const debt_schema_1 = require("../debts/schemas/debt.schema");
const note_schema_1 = require("../notes/schemas/note.schema");
const scheduled_payment_schema_1 = require("../scheduled-payments/schemas/scheduled-payment.schema");
const transaction_schema_1 = require("../transactions/schemas/transaction.schema");
const user_schema_1 = require("../users/schemas/user.schema");
const ai_cron_controller_1 = require("./ai-cron.controller");
const ai_controller_1 = require("./ai.controller");
const finance_assistant_service_1 = require("./finance-assistant.service");
const openrouter_llm_service_1 = require("./openrouter-llm.service");
const insights_coach_service_1 = require("./insights-coach.service");
const ocr_service_1 = require("./ocr.service");
const speech_service_1 = require("./speech.service");
const ai_chat_log_schema_1 = require("./ai-chat-log.schema");
const ai_chat_log_service_1 = require("./ai-chat-log.service");
const ai_finance_conversation_schema_1 = require("./ai-finance-conversation.schema");
const ai_finance_conversation_service_1 = require("./ai-finance-conversation.service");
const plans_module_1 = require("../plans/plans.module");
const translation_service_1 = require("./translation.service");
let AiModule = class AiModule {
};
exports.AiModule = AiModule;
exports.AiModule = AiModule = __decorate([
    (0, common_1.Module)({
        imports: [
            plans_module_1.PlansModule,
            mongoose_1.MongooseModule.forFeature([
                { name: user_schema_1.User.name, schema: user_schema_1.UserSchema },
                { name: transaction_schema_1.Transaction.name, schema: transaction_schema_1.TransactionSchema },
                { name: debt_schema_1.Debt.name, schema: debt_schema_1.DebtSchema },
                { name: note_schema_1.Note.name, schema: note_schema_1.NoteSchema },
                { name: scheduled_payment_schema_1.ScheduledPayment.name, schema: scheduled_payment_schema_1.ScheduledPaymentSchema },
                { name: ai_chat_log_schema_1.AiChatLog.name, schema: ai_chat_log_schema_1.AiChatLogSchema },
                { name: ai_finance_conversation_schema_1.AiFinanceConversation.name, schema: ai_finance_conversation_schema_1.AiFinanceConversationSchema }
            ])
        ],
        controllers: [ai_controller_1.AiController, ai_cron_controller_1.AiCronController],
        providers: [
            insights_coach_service_1.InsightsCoachService,
            finance_assistant_service_1.FinanceAssistantService,
            openrouter_llm_service_1.OpenRouterLlmService,
            translation_service_1.TranslationService,
            ocr_service_1.OcrService,
            speech_service_1.SpeechService,
            ai_chat_log_service_1.AiChatLogService,
            ai_finance_conversation_service_1.AiFinanceConversationService
        ],
        exports: [
            insights_coach_service_1.InsightsCoachService,
            finance_assistant_service_1.FinanceAssistantService,
            openrouter_llm_service_1.OpenRouterLlmService,
            translation_service_1.TranslationService,
            ocr_service_1.OcrService,
            speech_service_1.SpeechService,
            ai_chat_log_service_1.AiChatLogService,
            ai_finance_conversation_service_1.AiFinanceConversationService
        ]
    })
], AiModule);
//# sourceMappingURL=ai.module.js.map