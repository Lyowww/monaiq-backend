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
var InsightsCoachService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.InsightsCoachService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const shared_types_1 = require("@ai-finance/shared-types");
const schedule_1 = require("@nestjs/schedule");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const debt_mappers_1 = require("../debts/debt.mappers");
const debt_schema_1 = require("../debts/schemas/debt.schema");
const note_schema_1 = require("../notes/schemas/note.schema");
const transaction_schema_1 = require("../transactions/schemas/transaction.schema");
const transaction_mappers_1 = require("../transactions/transaction.mappers");
const user_schema_1 = require("../users/schemas/user.schema");
const gemini_llm_util_1 = require("./gemini-llm.util");
let InsightsCoachService = InsightsCoachService_1 = class InsightsCoachService {
    configService;
    userModel;
    transactionModel;
    debtModel;
    noteModel;
    logger = new common_1.Logger(InsightsCoachService_1.name);
    constructor(configService, userModel, transactionModel, debtModel, noteModel) {
        this.configService = configService;
        this.userModel = userModel;
        this.transactionModel = transactionModel;
        this.debtModel = debtModel;
        this.noteModel = noteModel;
    }
    async runDailyInsights() {
        const users = await this.userModel.find({}).limit(100).exec();
        for (const user of users) {
            try {
                await this.generateDailyInsightForUser(user);
            }
            catch (error) {
                const message = error instanceof Error ? error.message : 'Unknown AI insight failure';
                this.logger.error(`Failed to generate insight for user ${user._id.toString()}: ${message}`);
            }
        }
    }
    async generateDailyInsightForUser(user) {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setUTCDate(thirtyDaysAgo.getUTCDate() - 30);
        const userId = new mongoose_2.Types.ObjectId(user._id.toString());
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
        const promptInput = {
            currencyCode: 'AMD',
            currentBalanceMinor,
            transactions: transactions.map((item) => (0, transaction_mappers_1.mapTransaction)(item)),
            debts: debts.map((item) => (0, debt_mappers_1.mapDebt)(item)),
            notes: notes.map((item) => this.mapNote(item))
        };
        const apiKey = this.configService.get('GEMINI_API_KEY');
        if (!apiKey) {
            this.logger.warn('GEMINI_API_KEY is not configured; skipping AI insight generation.');
            return null;
        }
        const model = this.configService.get('GEMINI_MODEL') ?? gemini_llm_util_1.DEFAULT_GEMINI_MODEL;
        const response = await (0, gemini_llm_util_1.geminiGenerateContentText)({
            apiKey,
            model,
            systemInstruction: shared_types_1.FINANCE_COACH_SYSTEM_PROMPT,
            userText: (0, shared_types_1.buildFinanceCoachUserPrompt)(promptInput)
        });
        if (!response.ok) {
            const failureText = await response.text();
            throw new Error(`Gemini insight request failed: ${failureText}`);
        }
        const payload = (await response.json());
        const outputText = (0, gemini_llm_util_1.extractGeminiResponseText)(payload) || null;
        if (outputText) {
            await this.userModel
                .findByIdAndUpdate(user._id, {
                lastInsightAt: new Date()
            })
                .exec();
        }
        return outputText;
    }
    async calculateCurrentBalanceAllTime(userId) {
        const result = await this.transactionModel
            .aggregate([
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
    mapNote(note) {
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
};
exports.InsightsCoachService = InsightsCoachService;
__decorate([
    (0, schedule_1.Cron)('0 6 * * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], InsightsCoachService.prototype, "runDailyInsights", null);
exports.InsightsCoachService = InsightsCoachService = InsightsCoachService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __param(2, (0, mongoose_1.InjectModel)(transaction_schema_1.Transaction.name)),
    __param(3, (0, mongoose_1.InjectModel)(debt_schema_1.Debt.name)),
    __param(4, (0, mongoose_1.InjectModel)(note_schema_1.Note.name)),
    __metadata("design:paramtypes", [config_1.ConfigService,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], InsightsCoachService);
//# sourceMappingURL=insights-coach.service.js.map