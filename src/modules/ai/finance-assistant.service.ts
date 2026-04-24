import { Injectable, Logger, ServiceUnavailableException } from '@nestjs/common';
import {
  type FinanceAssistantContext,
  type FinanceAssistantReplyLanguage,
  buildFinanceAssistantUserPayload,
  getFinanceAssistantSystemPrompt,
  humanizeFinanceAssistantReply
} from '@ai-finance/shared-types';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { mapDebt } from '../debts/debt.mappers';
import { Debt } from '../debts/schemas/debt.schema';
import { mapScheduledPayment } from '../scheduled-payments/scheduled-mappers';
import { ScheduledPayment } from '../scheduled-payments/schemas/scheduled-payment.schema';
import { mapTransaction } from '../transactions/transaction.mappers';
import { Transaction } from '../transactions/schemas/transaction.schema';
import { User, UserDocument } from '../users/schemas/user.schema';
import { OPENROUTER_ALL_MODELS_FAILED_MESSAGE, isOpenRouterBadRequestError, OpenRouterLlmService } from './openrouter-llm.service';
import { PlansService } from '../plans/plans.service';
import { TranslationService } from './translation.service';

/** Free models: keep the user’s question and JSON context under strict limits. */
const MAX_USER_MESSAGE_CHARS = 2_000;
const LEAN_MAX_USER_CONTEXT_CHARS = 10_000;

@Injectable()
export class FinanceAssistantService {
  private readonly logger = new Logger(FinanceAssistantService.name);

  constructor(
    private readonly openRouter: OpenRouterLlmService,
    private readonly translation: TranslationService,
    private readonly plansService: PlansService,
    @InjectModel(Transaction.name) private readonly transactionModel: Model<Transaction>,
    @InjectModel(Debt.name) private readonly debtModel: Model<Debt>,
    @InjectModel(ScheduledPayment.name) private readonly paymentModel: Model<ScheduledPayment>,
    @InjectModel(User.name) private readonly userModel: Model<User>
  ) {}

  async answer(
    userId: string,
    message: string,
    replyLanguage: FinanceAssistantReplyLanguage,
    options?: { priorMessages?: { role: 'user' | 'assistant'; content: string }[] }
  ): Promise<string> {
    if (isNonFinanceMessage(message)) {
      return offTopicRefusal(replyLanguage);
    }

    const useEnglishModel = replyLanguage === 'hy';
    const systemPrompt = getFinanceAssistantSystemPrompt(useEnglishModel ? 'en' : replyLanguage);
    const userMessage = refineFinanceUserMessage(message);
    const prefix = formatPriorForPrompt(options?.priorMessages);
    let composed = userMessage;
    if (prefix) {
      composed = `${prefix}\n\nCurrent message:\n${userMessage}`;
    }
    if (useEnglishModel) {
      composed = await this.translation.translate(composed, 'en');
    }
    const ctx = await this.buildContext(userId);
    const userPayload = buildFinanceAssistantUserPayload(composed, ctx);

    if (!this.openRouter.isOpenRouterConfigured()) {
      throw new ServiceUnavailableException(
        'The finance assistant is not configured. Set OPENROUTER_API_KEY on the server.'
      );
    }

    this.logger.log(
      `OpenRouter finance chat: userId=${userId} lang=${replyLanguage} messageChars=${userMessage.length} models=${this.openRouter.getFallbackModels().join(' → ')}`
    );

    const slimContextNote = useEnglishModel
      ? '(Parts of the app context were trimmed for size limits. Net balance and 30-day totals are unchanged.)'
      : '(Հատվածներ են կրճատվել՝ ծրագրի ծավալին համապատասխան. Մնացորդը և 30-օրյա արդյունքը նույնն են)։';

    try {
      const replyEn = await this.openRouter.completeSystemUser(systemPrompt, userPayload, {
        maxUserChars: LEAN_MAX_USER_CONTEXT_CHARS
      });
      const plainEn = humanizeFinanceAssistantReply(replyEn);
      return useEnglishModel
        ? humanizeFinanceAssistantReply(await this.translation.translate(plainEn, 'hy'))
        : plainEn;
    } catch (err) {
      if (isOpenRouterBadRequestError(err)) {
        this.logger.warn(
          'OpenRouter returned 400 (often context too long for the free model); retrying with slim app context'
        );
        const slimCtx = await this.buildContext(userId, { slim: true });
        const slimPayload = buildFinanceAssistantUserPayload(
          `${composed}\n\n${slimContextNote}`,
          slimCtx
        );
        try {
          const replyEn = await this.openRouter.completeSystemUser(systemPrompt, slimPayload, {
            maxUserChars: Math.min(LEAN_MAX_USER_CONTEXT_CHARS, 6_000)
          });
          const plainEn = humanizeFinanceAssistantReply(replyEn);
          return useEnglishModel
            ? humanizeFinanceAssistantReply(await this.translation.translate(plainEn, 'hy'))
            : plainEn;
        } catch (err2) {
          this.logger.error(
            `OpenRouter still failing after slim context: ${(err2 as Error)?.message ?? err2}`,
            err2 instanceof Error ? err2.stack : undefined
          );
          throw new ServiceUnavailableException(OPENROUTER_ALL_MODELS_FAILED_MESSAGE);
        }
      }
      throw err;
    }
  }

  private async buildContext(
    userId: string,
    options?: { slim?: boolean }
  ): Promise<FinanceAssistantContext> {
    const slim = options?.slim === true;
    const recentLimit = slim ? 6 : 12;
    const debtLimit = slim ? 6 : 12;
    const payLimit = slim ? 5 : 10;
    const categoryTopN = slim ? 8 : 12;

    const uid = new Types.ObjectId(userId);
    const user = (await this.userModel.findById(userId).exec()) as UserDocument | null;
    const currencyCode = (user?.currencyCode ?? 'AMD') as FinanceAssistantContext['currencyCode'];
    const day30 = new Date();
    day30.setUTCDate(day30.getUTCDate() - 30);

    const [netRow, monthTotals, pocketRows, pocketNetRows, recent, debts, pay, byCat, activePlans] =
      await Promise.all([
        this.transactionModel
          .aggregate<{ net: number }>([
            { $match: { userId: uid } },
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
          .exec(),
        this.transactionModel
          .aggregate<{ _id: 'credit' | 'debit'; total: number }>([
            { $match: { userId: uid, bookedAt: { $gte: day30 } } },
            { $group: { _id: '$direction', total: { $sum: '$amountMinor' } } }
          ])
          .exec(),
        this.transactionModel
          .aggregate<{ _id: string | null; amountMinor: number }>([
            { $match: { userId: uid, direction: 'debit', bookedAt: { $gte: day30 } } },
            { $group: { _id: { $ifNull: ['$pocket', 'unspecified'] }, amountMinor: { $sum: '$amountMinor' } } }
          ])
          .exec(),
        this.transactionModel
          .aggregate<{ _id: 'card' | 'cash'; net: number }>([
            { $match: { userId: uid } },
            { $addFields: { pocketKey: { $ifNull: ['$pocket', 'card'] } } },
            {
              $addFields: {
                signed: {
                  $cond: [
                    { $eq: ['$direction', 'credit'] },
                    '$amountMinor',
                    { $multiply: ['$amountMinor', -1] }
                  ]
                }
              }
            },
            { $group: { _id: '$pocketKey', net: { $sum: '$signed' } } }
          ])
          .exec(),
        this.transactionModel.find({ userId: uid }).sort({ bookedAt: -1 }).limit(recentLimit).exec(),
        this.debtModel.find({ userId: uid, status: 'active' }).sort({ dueDate: 1 }).limit(debtLimit).exec(),
        this.paymentModel
          .find({ userId: uid, status: 'pending' })
          .sort({ dueDate: 1 })
          .limit(payLimit)
          .exec(),
        this.transactionModel
          .aggregate<{ _id: string; amountMinor: number }>([
            { $match: { userId: uid, direction: 'debit', bookedAt: { $gte: day30 } } },
            { $group: { _id: '$category', amountMinor: { $sum: '$amountMinor' } } },
            { $sort: { amountMinor: -1 } },
            { $limit: categoryTopN }
          ])
          .exec(),
        this.plansService.listActiveForAssistant(userId)
      ]);

    const credits30 = monthTotals.find((m) => m._id === 'credit')?.total ?? 0;
    const debits30 = monthTotals.find((m) => m._id === 'debit')?.total ?? 0;
    const netBal = netRow[0]?.net ?? 0;

    const amountUnit: FinanceAssistantContext['amountUnit'] =
      currencyCode === 'AMD'
        ? 'hundred_minor_units_equal_one_major_AMD_dram'
        : currencyCode === 'USD' || currencyCode === 'EUR'
          ? 'hundred_minor_units_equal_one_major_USD_EUR'
          : 'one_minor_unit_equals_one_unit_unspecified';

    const minorUnitsPerMajor: number =
      currencyCode === 'AMD' || currencyCode === 'USD' || currencyCode === 'EUR' ? 100 : 1;

    const cardNet = pocketNetRows.find((r) => r._id === 'card')?.net ?? 0;
    const cashNet = pocketNetRows.find((r) => r._id === 'cash')?.net ?? 0;
    const totalBalanceMajorUnits = Number((netBal / minorUnitsPerMajor).toFixed(2));

    const last30DaysDebitByPocket: FinanceAssistantContext['last30DaysDebitByPocket'] = pocketRows.map(
      (row) => {
        const raw = row._id ?? 'unspecified';
        if (raw === 'cash' || raw === 'card') {
          return { pocket: raw, amountMinor: row.amountMinor };
        }
        return { pocket: 'unspecified_defaults_to_card_in_app', amountMinor: row.amountMinor };
      }
    );

    return {
      generatedAtUtc: new Date().toISOString(),
      currencyCode,
      amountUnit,
      minorUnitsPerMajor,
      totalBalanceMajorUnits,
      pocketNetMinor: { card: cardNet, cash: cashNet },
      activeFinancialPlans: activePlans,
      netBalanceAllTransactionsMinor: netBal,
      last30Days: {
        totalCreditsMinor: credits30,
        totalDebitsMinor: debits30,
        netCashflowInWindowMinor: credits30 - debits30
      },
      last30DaysDebitByPocket,
      recentTransactions: recent.map((t) => mapTransaction(t)),
      debts: debts.map((d) => mapDebt(d)),
      upcomingScheduledPayments: pay.map((p) => mapScheduledPayment(p)),
      spendingByCategoryLast30Days: byCat.map((c) => ({ category: c._id, amountMinor: c.amountMinor })),
      unusualSpendingFlags: []
    };
  }
}

/** Obvious chit‑chat or general knowledge; block before calling the model. */
const OFFTOPIC_EXPLICIT =
  /\b(what is the weather|weather like|write (me )?code|python|javascript|java|homework|recipe for|tell me a joke|who won|sports? game|capitals? of|president of|netflix|movie|translate (this|from)|song lyrics|medical|legal advice)\b|^(hi|hello|hey)\b[^?.!]*$/i;

/**
 * If the user message is long but has no finance-related cue and no number, treat as off-topic
 * (model still gets strict system rules for the rest).
 */
const FINANCE_SIGNAL = new RegExp(
  [
    'balance|spend|spent|income|expense|afford|saving|debt|loan|rent|bills?|pay(ment|ing)?|salary|budget',
    'dram|amd|֏|money|purchas|afford|category|spend|categor(y|ies)|cash|card|amount|ow(e|ing)|due|savings?|earnings?|pocket',
    'how (much|do|is|are|can|should|am i)|can i|should i|what did|where did|is my|do i have|am i on',
    'ծախս|մնացորդ|դրամ|պարտք|վճար|եկամուտ|վարձ|խնայ|ֆինանս|անձնական',
    'կարո|ինչ(ու|քան)|ու[րն]', // hy: can I / why / where
    '\\b\\d{2,}\\b' // 2+ digit number — often a price
  ].join('|'),
  'i'
);

const SHORT_GRATITUDE_OR_ACK = /^(ok\.?|k\.?|no\.?|yes\.?|yep|nope|thanks!?|thank you|thx|հա\.?|ոչ\.?|Շնորհակալ.*)$/i;

function isNonFinanceMessage(message: string): boolean {
  const t = message.trim();
  if (t.length < 2) {
    return true;
  }
  if (t.length <= 40 && SHORT_GRATITUDE_OR_ACK.test(t)) {
    return false;
  }
  if (OFFTOPIC_EXPLICIT.test(t)) {
    return true;
  }
  if (t.length > 12 && !FINANCE_SIGNAL.test(t)) {
    return true;
  }
  return false;
}

function refineFinanceUserMessage(message: string): string {
  const t = message.trim();
  if (t.length <= MAX_USER_MESSAGE_CHARS) {
    return t;
  }
  return t.slice(0, MAX_USER_MESSAGE_CHARS) + '\n\n(Խնդրի տեքստը չափից երկար էր, կրճատվել է։)';
}

const PRIOR_TURN_MAX = 14;
const PRIOR_BLOCK_MAX_CHARS = 3500;

function formatPriorForPrompt(prior?: { role: 'user' | 'assistant'; content: string }[]): string {
  if (!prior?.length) {
    return '';
  }
  const slice = prior.length > PRIOR_TURN_MAX ? prior.slice(-PRIOR_TURN_MAX) : prior;
  const lines: string[] = [];
  let total = 0;
  for (let i = slice.length - 1; i >= 0; i--) {
    const m = slice[i]!;
    const line = `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`;
    if (total + line.length > PRIOR_BLOCK_MAX_CHARS) {
      break;
    }
    lines.unshift(line);
    total += line.length;
  }
  return lines.length > 0 ? `Earlier in this conversation:\n${lines.join('\n')}` : '';
}

function offTopicRefusal(lang: FinanceAssistantReplyLanguage): string {
  if (lang === 'hy') {
    return 'Այս հավելվածում կարող եմ օգնել միայն անձնական ֆինանսներով՝ մնացորդ, եկամուտ, ծախս, խնայողություն և պարտքեր. Փորձեք նման հարց՝ «Կարո՞ղ եմ հիմա այս գնումն անել»։';
  }
  return 'I can only help with your personal finance in this app—balances, income, spending, savings, and debt. Try something like “Can I afford this purchase right now?”';
}
