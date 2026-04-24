"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var FinanceAssistantService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FinanceAssistantService = void 0;
const common_1 = require("@nestjs/common");
const shared_types_1 = require("@ai-finance/shared-types");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const debt_mappers_1 = require("../debts/debt.mappers");
const debt_schema_1 = require("../debts/schemas/debt.schema");
const scheduled_mappers_1 = require("../scheduled-payments/scheduled-mappers");
const scheduled_payment_schema_1 = require("../scheduled-payments/schemas/scheduled-payment.schema");
const transaction_mappers_1 = require("../transactions/transaction.mappers");
const transaction_schema_1 = require("../transactions/schemas/transaction.schema");
const user_schema_1 = require("../users/schemas/user.schema");
const openrouter_llm_service_1 = require("./openrouter-llm.service");
const plans_service_1 = require("../plans/plans.service");
const translation_service_1 = require("./translation.service");
/** Free models: keep the user’s question and JSON context under strict limits. */
const MAX_USER_MESSAGE_CHARS = 2_000;
const LEAN_MAX_USER_CONTEXT_CHARS = 10_000;
let FinanceAssistantService = FinanceAssistantService_1 = class FinanceAssistantService {
    openRouter;
    translation;
    plansService;
    transactionModel;
    debtModel;
    paymentModel;
    userModel;
    logger = new common_1.Logger(FinanceAssistantService_1.name);
    constructor(openRouter, translation, plansService, transactionModel, debtModel, paymentModel, userModel) {
        this.openRouter = openRouter;
        this.translation = translation;
        this.plansService = plansService;
        this.transactionModel = transactionModel;
        this.debtModel = debtModel;
        this.paymentModel = paymentModel;
        this.userModel = userModel;
    }
    async answer(userId, message, replyLanguage, options) {
        if (isNonFinanceMessage(message)) {
            return offTopicRefusal(replyLanguage);
        }
        const useEnglishModel = replyLanguage === 'hy';
        const systemPrompt = (0, shared_types_1.getFinanceAssistantSystemPrompt)(useEnglishModel ? 'en' : replyLanguage);
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
        const userPayload = (0, shared_types_1.buildFinanceAssistantUserPayload)(composed, ctx);
        if (!this.openRouter.isOpenRouterConfigured()) {
            throw new common_1.ServiceUnavailableException('The finance assistant is not configured. Set OPENROUTER_API_KEY on the server.');
        }
        this.logger.log(`OpenRouter finance chat: userId=${userId} lang=${replyLanguage} messageChars=${userMessage.length} models=${this.openRouter.getFallbackModels().join(' → ')}`);
        const slimContextNote = useEnglishModel
            ? '(Parts of the app context were trimmed for size limits. Net balance and 30-day totals are unchanged.)'
            : '(Հատվածներ են կրճատվել՝ ծրագրի ծավալին համապատասխան. Մնացորդը և 30-օրյա արդյունքը նույնն են)։';
        try {
            const replyEn = await this.openRouter.completeSystemUser(systemPrompt, userPayload, {
                maxUserChars: LEAN_MAX_USER_CONTEXT_CHARS
            });
            const plainEn = (0, shared_types_1.humanizeFinanceAssistantReply)(replyEn);
            return useEnglishModel
                ? (0, shared_types_1.humanizeFinanceAssistantReply)(await this.translation.translate(plainEn, 'hy'))
                : plainEn;
        }
        catch (err) {
            if ((0, openrouter_llm_service_1.isOpenRouterBadRequestError)(err)) {
                this.logger.warn('OpenRouter returned 400 (often context too long for the free model); retrying with slim app context');
                const slimCtx = await this.buildContext(userId, { slim: true });
                const slimPayload = (0, shared_types_1.buildFinanceAssistantUserPayload)(`${composed}\n\n${slimContextNote}`, slimCtx);
                try {
                    const replyEn = await this.openRouter.completeSystemUser(systemPrompt, slimPayload, {
                        maxUserChars: Math.min(LEAN_MAX_USER_CONTEXT_CHARS, 6_000)
                    });
                    const plainEn = (0, shared_types_1.humanizeFinanceAssistantReply)(replyEn);
                    return useEnglishModel
                        ? (0, shared_types_1.humanizeFinanceAssistantReply)(await this.translation.translate(plainEn, 'hy'))
                        : plainEn;
                }
                catch (err2) {
                    this.logger.error(`OpenRouter still failing after slim context: ${err2?.message ?? err2}`, err2 instanceof Error ? err2.stack : undefined);
                    throw new common_1.ServiceUnavailableException(openrouter_llm_service_1.OPENROUTER_ALL_MODELS_FAILED_MESSAGE);
                }
            }
            throw err;
        }
    }
    async buildContext(userId, options) {
        const slim = options?.slim === true;
        const recentLimit = slim ? 6 : 12;
        const debtLimit = slim ? 6 : 12;
        const payLimit = slim ? 5 : 10;
        const categoryTopN = slim ? 8 : 12;
        const uid = new mongoose_2.Types.ObjectId(userId);
        const user = (await this.userModel.findById(userId).exec());
        const currencyCode = (user?.currencyCode ?? 'AMD');
        const day30 = new Date();
        day30.setUTCDate(day30.getUTCDate() - 30);
        const [netRow, monthTotals, pocketRows, pocketNetRows, recent, debts, pay, byCat, activePlans] = await Promise.all([
            this.transactionModel
                .aggregate([
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
                .aggregate([
                { $match: { userId: uid, bookedAt: { $gte: day30 } } },
                { $group: { _id: '$direction', total: { $sum: '$amountMinor' } } }
            ])
                .exec(),
            this.transactionModel
                .aggregate([
                { $match: { userId: uid, direction: 'debit', bookedAt: { $gte: day30 } } },
                { $group: { _id: { $ifNull: ['$pocket', 'unspecified'] }, amountMinor: { $sum: '$amountMinor' } } }
            ])
                .exec(),
            this.transactionModel
                .aggregate([
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
                .aggregate([
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
        const amountUnit = currencyCode === 'AMD'
            ? 'hundred_minor_units_equal_one_major_AMD_dram'
            : currencyCode === 'USD' || currencyCode === 'EUR'
                ? 'hundred_minor_units_equal_one_major_USD_EUR'
                : 'one_minor_unit_equals_one_unit_unspecified';
        const minorUnitsPerMajor = currencyCode === 'AMD' || currencyCode === 'USD' || currencyCode === 'EUR' ? 100 : 1;
        const cardNet = pocketNetRows.find((r) => r._id === 'card')?.net ?? 0;
        const cashNet = pocketNetRows.find((r) => r._id === 'cash')?.net ?? 0;
        const totalBalanceMajorUnits = Number((netBal / minorUnitsPerMajor).toFixed(2));
        const last30DaysDebitByPocket = pocketRows.map((row) => {
            const raw = row._id ?? 'unspecified';
            if (raw === 'cash' || raw === 'card') {
                return { pocket: raw, amountMinor: row.amountMinor };
            }
            return { pocket: 'unspecified_defaults_to_card_in_app', amountMinor: row.amountMinor };
        });
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
            recentTransactions: recent.map((t) => (0, transaction_mappers_1.mapTransaction)(t)),
            debts: debts.map((d) => (0, debt_mappers_1.mapDebt)(d)),
            upcomingScheduledPayments: pay.map((p) => (0, scheduled_mappers_1.mapScheduledPayment)(p)),
            spendingByCategoryLast30Days: byCat.map((c) => ({ category: c._id, amountMinor: c.amountMinor })),
            unusualSpendingFlags: []
        };
    }
};
exports.FinanceAssistantService = FinanceAssistantService;
exports.FinanceAssistantService = FinanceAssistantService = FinanceAssistantService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(3, (0, mongoose_1.InjectModel)(transaction_schema_1.Transaction.name)),
    __param(4, (0, mongoose_1.InjectModel)(debt_schema_1.Debt.name)),
    __param(5, (0, mongoose_1.InjectModel)(scheduled_payment_schema_1.ScheduledPayment.name)),
    __param(6, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [openrouter_llm_service_1.OpenRouterLlmService,
        translation_service_1.TranslationService,
        plans_service_1.PlansService,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], FinanceAssistantService);
/** Obvious chit‑chat or general knowledge; block before calling the model. */
const OFFTOPIC_EXPLICIT = /\b(what is the weather|weather like|write (me )?code|python|javascript|java|homework|recipe for|tell me a joke|who won|sports? game|capitals? of|president of|netflix|movie|translate (this|from)|song lyrics|medical|legal advice)\b|^(hi|hello|hey)\b[^?.!]*$/i;
/**
 * If the user message is long but has no finance-related cue and no number, treat as off-topic
 * (model still gets strict system rules for the rest).
 */
const FINANCE_SIGNAL = new RegExp([
    'balance|spend|spent|income|expense|afford|saving|debt|loan|rent|bills?|pay(ment|ing)?|salary|budget',
    'dram|amd|֏|money|purchas|afford|category|spend|categor(y|ies)|cash|card|amount|ow(e|ing)|due|savings?|earnings?|pocket',
    'how (much|do|is|are|can|should|am i)|can i|should i|what did|where did|is my|do i have|am i on',
    'ծախս|մնացորդ|դրամ|պարտք|վճար|եկամուտ|վարձ|խնայ|ֆինանս|անձնական',
    'կարո|ինչ(ու|քան)|ու[րն]', // hy: can I / why / where
    '\b\d{2,}\b' // 2+ digit number — often a price
].join('|'), 'i');
const SHORT_GRATITUDE_OR_ACK = /^(ok\.?|k\.?|no\.?|yes\.?|yep|nope|thanks!?|thank you|thx|հա\.?|ոչ\.?|Շնորհակալ.*)$/i;
function isNonFinanceMessage(message) {
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
function refineFinanceUserMessage(message) {
    const t = message.trim();
    if (t.length <= MAX_USER_MESSAGE_CHARS) {
        return t;
    }
    return t.slice(0, MAX_USER_MESSAGE_CHARS) + '\n\n(Խնդրի տեքստը չափից երկար էր, կրճատվել է։)';
}
const PRIOR_TURN_MAX = 14;
const PRIOR_BLOCK_MAX_CHARS = 3500;
function formatPriorForPrompt(prior) {
    if (!prior?.length) {
        return '';
    }
    const slice = prior.length > PRIOR_TURN_MAX ? prior.slice(-PRIOR_TURN_MAX) : prior;
    const lines = [];
    let total = 0;
    for (let i = slice.length - 1; i >= 0; i--) {
        const m = slice[i];
        const line = `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`;
        if (total + line.length > PRIOR_BLOCK_MAX_CHARS) {
            break;
        }
        lines.unshift(line);
        total += line.length;
    }
    return lines.length > 0 ? `Earlier in this conversation:\n${lines.join('\n')}` : '';
}
function offTopicRefusal(lang) {
    if (lang === 'hy') {
        return 'Այս հավելվածում կարող եմ օգնել միայն անձնական ֆինանսներով՝ մնացորդ, եկամուտ, ծախս, խնայողություն և պարտքեր. Փորձեք նման հարց՝ «Կարո՞ղ եմ հիմա այս գնումն անել»։';
    }
    return 'I can only help with your personal finance in this app—balances, income, spending, savings, and debt. Try something like “Can I afford this purchase right now?”';
}
//# sourceMappingURL=finance-assistant.service.js.map