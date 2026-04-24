import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  FINANCE_COACH_SYSTEM_PROMPT,
  buildFinanceCoachUserPrompt,
  type FinanceCoachPromptInput
} from '@ai-finance/shared-types';
import { Cron } from '@nestjs/schedule';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { mapDebt } from '../debts/debt.mappers';
import { Debt } from '../debts/schemas/debt.schema';
import { Note, NoteDocument } from '../notes/schemas/note.schema';
import { Transaction } from '../transactions/schemas/transaction.schema';
import { mapTransaction } from '../transactions/transaction.mappers';
import { User, UserDocument } from '../users/schemas/user.schema';
import {
  DEFAULT_GEMINI_MODEL,
  extractGeminiResponseText,
  geminiGenerateContentText
} from './gemini-llm.util';

@Injectable()
export class InsightsCoachService {
  private readonly logger = new Logger(InsightsCoachService.name);

  constructor(
    private readonly configService: ConfigService,
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Transaction.name) private readonly transactionModel: Model<Transaction>,
    @InjectModel(Debt.name) private readonly debtModel: Model<Debt>,
    @InjectModel(Note.name) private readonly noteModel: Model<Note>
  ) {}

  @Cron('0 6 * * *')
  async runDailyInsights(): Promise<void> {
    const users = await this.userModel.find({}).limit(100).exec();

    for (const user of users) {
      try {
        await this.generateDailyInsightForUser(user);
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown AI insight failure';
        this.logger.error(`Failed to generate insight for user ${user._id.toString()}: ${message}`);
      }
    }
  }

  async generateDailyInsightForUser(user: UserDocument): Promise<string | null> {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setUTCDate(thirtyDaysAgo.getUTCDate() - 30);
    const userId = new Types.ObjectId(user._id.toString());

    const [transactions, debts, notes] = await Promise.all([
      this.transactionModel
        .find({
          userId,
          bookedAt: { $gte: thirtyDaysAgo }
        })
        .sort({ bookedAt: -1 })
        .limit(120)
        .exec(),
      this.debtModel
        .find({
          userId,
          status: 'active'
        })
        .exec(),
      this.noteModel
        .find({
          userId,
          status: 'scheduled'
        })
        .exec()
    ]);

    const currentBalanceMinor = await this.calculateCurrentBalanceAllTime(userId);
    const promptInput: FinanceCoachPromptInput = {
      currencyCode: 'AMD',
      currentBalanceMinor,
      transactions: transactions.map((item) => mapTransaction(item)),
      debts: debts.map((item) => mapDebt(item)),
      notes: notes.map((item) => this.mapNote(item))
    };

    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    if (!apiKey) {
      this.logger.warn('GEMINI_API_KEY is not configured; skipping AI insight generation.');
      return null;
    }

    const model = this.configService.get<string>('GEMINI_MODEL') ?? DEFAULT_GEMINI_MODEL;
    const response = await geminiGenerateContentText({
      apiKey,
      model,
      systemInstruction: FINANCE_COACH_SYSTEM_PROMPT,
      userText: buildFinanceCoachUserPrompt(promptInput)
    });

    if (!response.ok) {
      const failureText = await response.text();
      throw new Error(`Gemini insight request failed: ${failureText}`);
    }

    const payload = (await response.json()) as unknown;
    const outputText = extractGeminiResponseText(payload) || null;

    if (outputText) {
      await this.userModel
        .findByIdAndUpdate(user._id, {
          lastInsightAt: new Date()
        })
        .exec();
    }

    return outputText;
  }

  private async calculateCurrentBalanceAllTime(userId: Types.ObjectId): Promise<number> {
    const result = await this.transactionModel
      .aggregate<{ net: number }>([
        { $match: { userId } },
        {
          $group: {
            _id: null,
            net: {
              $sum: {
                $cond: [{ $eq: ['$direction', 'credit'] }, '$amountMinor', { $multiply: ['$amountMinor', -1] }]
              }
            }
          }
        }
      ])
      .exec();
    return result[0]?.net ?? 0;
  }

  private mapNote(note: NoteDocument) {
    return {
      id: note._id.toString(),
      userId: note.userId.toString(),
      title: note.title,
      body: note.body,
      dueDate: note.dueDate.toISOString(),
      totalObligationMinor: note.totalObligationMinor,
      projectedBalanceMinor: note.projectedBalanceMinor,
      status: note.status,
      aiWarningTriggered: note.aiWarningTriggered
    };
  }
}
