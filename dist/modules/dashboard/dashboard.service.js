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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const debt_mappers_1 = require("../debts/debt.mappers");
const debt_schema_1 = require("../debts/schemas/debt.schema");
const scheduled_mappers_1 = require("../scheduled-payments/scheduled-mappers");
const scheduled_payment_schema_1 = require("../scheduled-payments/schemas/scheduled-payment.schema");
const transaction_mappers_1 = require("../transactions/transaction.mappers");
const note_schema_1 = require("../notes/schemas/note.schema");
const transaction_schema_1 = require("../transactions/schemas/transaction.schema");
const users_service_1 = require("../users/users.service");
let DashboardService = class DashboardService {
    usersService;
    transactionModel;
    debtModel;
    noteModel;
    paymentModel;
    constructor(usersService, transactionModel, debtModel, noteModel, paymentModel) {
        this.usersService = usersService;
        this.transactionModel = transactionModel;
        this.debtModel = debtModel;
        this.noteModel = noteModel;
        this.paymentModel = paymentModel;
    }
    async getSummary(userId) {
        const userObjectId = new mongoose_2.Types.ObjectId(userId);
        const monthStart = new Date();
        monthStart.setUTCDate(1);
        monthStart.setUTCHours(0, 0, 0, 0);
        const obligationWindow = new Date();
        obligationWindow.setUTCDate(obligationWindow.getUTCDate() + 30);
        const soon = new Date();
        soon.setUTCDate(soon.getUTCDate() + 3);
        const day30 = new Date();
        day30.setUTCDate(day30.getUTCDate() - 30);
        const day60 = new Date();
        day60.setUTCDate(day60.getUTCDate() - 60);
        const [balanceTotals, pocketNets, monthTotals, month30Totals, recentTransactions, activeDebts, scheduledPending, scheduledNotes, user, merchantSuggest, categorySuggest] = await Promise.all([
            this.aggregateTotals(userObjectId),
            this.aggregatePocketNets(userObjectId),
            this.aggregateTotals(userObjectId, monthStart),
            this.aggregateTotals(userObjectId, day30),
            this.transactionModel
                .find({ userId: userObjectId })
                .sort({ bookedAt: -1 })
                .limit(8)
                .exec(),
            this.debtModel
                .find({
                userId: userObjectId,
                status: 'active'
            })
                .sort({ dueDate: 1 })
                .exec(),
            this.paymentModel
                .find({ userId: userObjectId, status: 'pending' })
                .sort({ dueDate: 1 })
                .limit(50)
                .exec(),
            this.noteModel
                .find({
                userId: userObjectId,
                status: 'scheduled'
            })
                .sort({ dueDate: 1 })
                .exec(),
            this.usersService.findById(userId),
            this.aggregateTopMerchants(userObjectId, day60),
            this.aggregateCategorySpend(userObjectId, day30)
        ]);
        const liquidBalanceMinor = this.pickTotal(balanceTotals, 'credit') - this.pickTotal(balanceTotals, 'debit');
        const monthlyInflowMinor = this.pickTotal(monthTotals, 'credit');
        const monthlyOutflowMinor = this.pickTotal(monthTotals, 'debit');
        const in30 = this.pickTotal(month30Totals, 'credit');
        const out30 = this.pickTotal(month30Totals, 'debit');
        const threshold = user?.settings?.lowBalanceThresholdMinor ?? 0;
        const obligationDueMinor = activeDebts
            .filter((debt) => debt.dueDate <= obligationWindow)
            .reduce((sum, debt) => sum + debt.minimumDueMinor, 0) +
            scheduledNotes
                .filter((note) => note.dueDate <= obligationWindow)
                .reduce((sum, note) => sum + note.totalObligationMinor, 0) +
            scheduledPending
                .filter((p) => p.dueDate <= obligationWindow)
                .reduce((sum, p) => sum + p.amountMinor, 0);
        const smartSuggestions = {
            recentMerchants: merchantSuggest,
            topCategories: categorySuggest
        };
        const autoInsights = this.buildAutoInsights({
            liquidBalanceMinor,
            monthlyInflowMinor,
            monthlyOutflowMinor,
            threshold,
            activeDebts,
            scheduledPending,
            in30,
            out30
        });
        const debtsIOwe = activeDebts.filter((d) => (d.debtType ?? 'I_OWE') === 'I_OWE');
        const debtsTheyOweMe = activeDebts.filter((d) => d.debtType === 'THEY_OWE');
        const upcomingPayments = scheduledPending.filter((p) => p.dueDate <= soon);
        const recurringPayments = scheduledPending.filter((p) => p.recurring);
        return {
            currencyCode: 'AMD',
            liquidBalanceMinor,
            cardBalanceMinor: pocketNets.cardNet,
            cashOnHandMinor: pocketNets.cashNet,
            monthlyInflowMinor,
            monthlyOutflowMinor,
            obligationDueMinor,
            debtPressureScore: this.calculateDebtPressureScore(activeDebts),
            recentTransactions: recentTransactions.map((transaction) => (0, transaction_mappers_1.mapTransaction)(transaction)),
            aiWarnings: this.buildAiWarnings(scheduledNotes),
            lastInsightAt: user?.lastInsightAt?.toISOString(),
            upcomingPayments: upcomingPayments.map((p) => (0, scheduled_mappers_1.mapScheduledPayment)(p)),
            recurringPayments: recurringPayments.map((p) => (0, scheduled_mappers_1.mapScheduledPayment)(p)),
            debtsIOwe: debtsIOwe.map((d) => (0, debt_mappers_1.mapDebt)(d)),
            debtsTheyOweMe: debtsTheyOweMe.map((d) => (0, debt_mappers_1.mapDebt)(d)),
            smartSuggestions,
            autoInsights
        };
    }
    buildAutoInsights(input) {
        const out = [];
        const { liquidBalanceMinor, monthlyInflowMinor, monthlyOutflowMinor, threshold, activeDebts, scheduledPending, in30, out30 } = input;
        if (monthlyInflowMinor > 0 && monthlyOutflowMinor / monthlyInflowMinor > 0.92) {
            out.push({
                id: 'spend-income-ratio',
                type: 'overspending',
                title: 'Spending near income',
                message: 'This month, expenses are very close to or above income. Pause discretionary spending until a buffer returns.',
                severity: monthlyOutflowMinor > monthlyInflowMinor ? 'critical' : 'warning'
            });
        }
        else if (in30 > 0 && out30 / in30 > 0.9) {
            out.push({
                id: 'spend-30d',
                type: 'overspending',
                title: 'Tight 30-day window',
                message: 'Last 30 days, outflows are high relative to inflows. Review recurring bills and food spend.',
                severity: 'warning'
            });
        }
        if (threshold > 0 && liquidBalanceMinor < threshold) {
            out.push({
                id: 'low-balance',
                type: 'low_balance',
                title: 'Low balance',
                message: `Balance is below your ${threshold} (minor) alert threshold. Prioritize must-pay items.`,
                severity: 'critical'
            });
        }
        const now = Date.now();
        for (const p of scheduledPending) {
            const days = Math.ceil((p.dueDate.getTime() - now) / (86400 * 1000));
            if (days >= 0 && days <= 2) {
                out.push({
                    id: `pay-${p._id.toString()}`,
                    type: 'upcoming_payment',
                    title: `Due soon: ${p.title}`,
                    message: `Amount ${p.amountMinor} (minor) · ${days === 0 ? 'today' : `in ${days}d`}.`,
                    severity: days === 0 ? 'warning' : 'info'
                });
                break;
            }
        }
        for (const d of activeDebts) {
            const days = Math.ceil((d.dueDate.getTime() - now) / (86400 * 1000));
            if (days >= 0 && days <= 2 && d.reminderEnabled !== false) {
                const n = d.personName?.trim() || d.lenderName;
                out.push({
                    id: `debt-${d._id.toString()}`,
                    type: 'debt_due',
                    title: `Debt: ${n}`,
                    message: `Active obligation — due ${days === 0 ? 'today' : `in ${days}d`}.`,
                    severity: 'warning'
                });
                break;
            }
        }
        return out.slice(0, 6);
    }
    async aggregateTopMerchants(userId, since) {
        const rows = await this.transactionModel
            .aggregate([
            {
                $match: {
                    userId,
                    direction: 'debit',
                    bookedAt: { $gte: since },
                    merchantName: { $exists: true, $ne: '' }
                }
            },
            {
                $group: {
                    _id: '$merchantName',
                    c: { $sum: 1 },
                    last: { $max: '$bookedAt' }
                }
            },
            { $sort: { c: -1 } },
            { $limit: 5 }
        ])
            .exec();
        return rows.map((r) => ({
            merchant: r._id,
            count: r.c,
            lastAt: r.last.toISOString()
        }));
    }
    async aggregateCategorySpend(userId, since) {
        const rows = await this.transactionModel
            .aggregate([
            {
                $match: {
                    userId,
                    direction: 'debit',
                    bookedAt: { $gte: since }
                }
            },
            {
                $group: {
                    _id: '$category',
                    amountMinor: { $sum: '$amountMinor' }
                }
            },
            { $sort: { amountMinor: -1 } },
            { $limit: 5 }
        ])
            .exec();
        return rows.map((r) => ({ category: r._id, amountMinor: r.amountMinor }));
    }
    async aggregatePocketNets(userId) {
        const rows = await this.transactionModel
            .aggregate([
            { $match: { userId } },
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
            {
                $group: {
                    _id: '$pocketKey',
                    net: { $sum: '$signed' }
                }
            }
        ])
            .exec();
        return {
            cardNet: rows.find((r) => r._id === 'card')?.net ?? 0,
            cashNet: rows.find((r) => r._id === 'cash')?.net ?? 0
        };
    }
    aggregateTotals(userId, bookedAtGte) {
        const matchStage = bookedAtGte
            ? {
                userId,
                bookedAt: {
                    $gte: bookedAtGte
                }
            }
            : { userId };
        return this.transactionModel
            .aggregate([
            { $match: matchStage },
            {
                $group: {
                    _id: '$direction',
                    total: {
                        $sum: '$amountMinor'
                    }
                }
            }
        ])
            .exec();
    }
    pickTotal(items, direction) {
        return items.find((item) => item._id === direction)?.total ?? 0;
    }
    buildAiWarnings(notes) {
        return notes
            .filter((note) => note.projectedBalanceMinor < note.totalObligationMinor)
            .map((note) => {
            const deficitMinor = note.totalObligationMinor - note.projectedBalanceMinor;
            const severity = deficitMinor >= 100_000 ? 'critical' : deficitMinor >= 40_000 ? 'high' : 'medium';
            return {
                noteId: note._id.toString(),
                title: note.title,
                dueDate: note.dueDate.toISOString(),
                projectedBalanceMinor: note.projectedBalanceMinor,
                totalObligationMinor: note.totalObligationMinor,
                severity,
                message: `Projected balance is short by ${deficitMinor} AMD minor units before ${note.title} becomes due.`
            };
        });
    }
    calculateDebtPressureScore(debts) {
        if (debts.length === 0) {
            return 0;
        }
        const relationshipWeights = {
            family: 1,
            friend: 0.92,
            fintech: 0.8,
            bank: 0.72,
            other: 0.65
        };
        const totalScore = debts.reduce((score, debt) => {
            const daysUntilDue = Math.ceil((debt.dueDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
            const urgencyScore = daysUntilDue <= 0 ? 35 : daysUntilDue <= 7 ? 28 : daysUntilDue <= 30 ? 18 : 8;
            const interestScore = Math.min((debt.aprPercent / 45) * 30, 30);
            const exposureScore = Math.min((debt.outstandingMinor / Math.max(debt.minimumDueMinor, 1)) * 4, 20);
            const relationshipScore = 15 * relationshipWeights[debt.relationship];
            return score + urgencyScore + interestScore + exposureScore + relationshipScore;
        }, 0);
        return Math.min(100, Math.round(totalScore / debts.length));
    }
};
exports.DashboardService = DashboardService;
exports.DashboardService = DashboardService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, mongoose_1.InjectModel)(transaction_schema_1.Transaction.name)),
    __param(2, (0, mongoose_1.InjectModel)(debt_schema_1.Debt.name)),
    __param(3, (0, mongoose_1.InjectModel)(note_schema_1.Note.name)),
    __param(4, (0, mongoose_1.InjectModel)(scheduled_payment_schema_1.ScheduledPayment.name)),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], DashboardService);
//# sourceMappingURL=dashboard.service.js.map