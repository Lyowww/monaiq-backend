import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Debt, DebtSchema } from '../debts/schemas/debt.schema';
import { Note, NoteSchema } from '../notes/schemas/note.schema';
import { ScheduledPayment, ScheduledPaymentSchema } from '../scheduled-payments/schemas/scheduled-payment.schema';
import { Transaction, TransactionSchema } from '../transactions/schemas/transaction.schema';
import { User, UserSchema } from '../users/schemas/user.schema';
import { AiCronController } from './ai-cron.controller';
import { AiController } from './ai.controller';
import { FinanceAssistantService } from './finance-assistant.service';
import { OpenRouterLlmService } from './openrouter-llm.service';
import { InsightsCoachService } from './insights-coach.service';
import { OcrService } from './ocr.service';
import { SpeechService } from './speech.service';
import { AiChatLog, AiChatLogSchema } from './ai-chat-log.schema';
import { AiChatLogService } from './ai-chat-log.service';
import { AiFinanceConversation, AiFinanceConversationSchema } from './ai-finance-conversation.schema';
import { AiFinanceConversationService } from './ai-finance-conversation.service';
import { PlansModule } from '../plans/plans.module';
import { TranslationService } from './translation.service';

@Module({
  imports: [
    PlansModule,
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Transaction.name, schema: TransactionSchema },
      { name: Debt.name, schema: DebtSchema },
      { name: Note.name, schema: NoteSchema },
      { name: ScheduledPayment.name, schema: ScheduledPaymentSchema },
      { name: AiChatLog.name, schema: AiChatLogSchema },
      { name: AiFinanceConversation.name, schema: AiFinanceConversationSchema }
    ])
  ],
  controllers: [AiController, AiCronController],
  providers: [
    InsightsCoachService,
    FinanceAssistantService,
    OpenRouterLlmService,
    TranslationService,
    OcrService,
    SpeechService,
    AiChatLogService,
    AiFinanceConversationService
  ],
  exports: [
    InsightsCoachService,
    FinanceAssistantService,
    OpenRouterLlmService,
    TranslationService,
    OcrService,
    SpeechService,
    AiChatLogService,
    AiFinanceConversationService
  ]
})
export class AiModule {}
