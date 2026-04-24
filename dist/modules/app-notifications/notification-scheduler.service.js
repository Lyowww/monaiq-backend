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
var NotificationSchedulerService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationSchedulerService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const schedule_1 = require("@nestjs/schedule");
const user_schema_1 = require("../users/schemas/user.schema");
const debt_schema_1 = require("../debts/schemas/debt.schema");
const transaction_schema_1 = require("../transactions/schemas/transaction.schema");
const scheduled_payment_schema_1 = require("../scheduled-payments/schemas/scheduled-payment.schema");
const app_notifications_service_1 = require("./app-notifications.service");
function startOfUtcDay(d) {
    const x = new Date(d.getTime());
    x.setUTCHours(0, 0, 0, 0);
    return x;
}
let NotificationSchedulerService = NotificationSchedulerService_1 = class NotificationSchedulerService {
    userModel;
    debtModel;
    transactionModel;
    paymentModel;
    appNotifications;
    logger = new common_1.Logger(NotificationSchedulerService_1.name);
    constructor(userModel, debtModel, transactionModel, paymentModel, appNotifications) {
        this.userModel = userModel;
        this.debtModel = debtModel;
        this.transactionModel = transactionModel;
        this.paymentModel = paymentModel;
        this.appNotifications = appNotifications;
    }
    async runDailyReminders() {
        try {
            const users = await this.userModel.find().limit(500).exec();
            for (const u of users) {
                try {
                    await this.evaluateUser(u);
                }
                catch (e) {
                    const m = e instanceof Error ? e.message : String(e);
                    this.logger.warn(`Notification pass failed for ${u._id.toString()}: ${m}`);
                }
            }
        }
        catch (e) {
            const m = e instanceof Error ? e.message : String(e);
            this.logger.error(`Notification batch failed: ${m}`);
        }
    }
    /** Used by internal cron HTTP as well */
    async evaluateUser(u) {
        const uid = u._id;
        const threshold = u.settings?.lowBalanceThresholdMinor ?? 0;
        const now = new Date();
        const in2 = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000);
        const dayStart = startOfUtcDay(now);
        const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000);
        const thisWeekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const prevWeekStart = new Date(thisWeekStart.getTime() - 7 * 24 * 60 * 60 * 1000);
        const [balanceDocs, payDue, debtDue, weekSpend, prevWeekSpend] = await Promise.all([
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
            this.paymentModel
                .find({
                userId: uid,
                status: 'pending',
                reminderEnabled: true,
                dueDate: { $lte: in2 }
            })
                .sort({ dueDate: 1 })
                .limit(20)
                .exec(),
            this.debtModel
                .find({
                userId: uid,
                status: 'active',
                reminderEnabled: true,
                dueDate: { $lte: in2 }
            })
                .sort({ dueDate: 1 })
                .limit(20)
                .exec(),
            this.sumDebitWindow(uid, thisWeekStart, now),
            this.sumDebitWindow(uid, prevWeekStart, thisWeekStart)
        ]);
        const net = balanceDocs[0]?.net ?? 0;
        if (threshold > 0 && net < threshold && u.settings?.notificationLowBalance !== false) {
            await this.appNotifications.createIfNew(u._id.toString(), {
                type: 'low_balance',
                title: 'Low balance',
                message: `Your balance is below your ${threshold} AMD (minor) threshold. Review upcoming bills before spending.`,
                scheduledAt: now
            });
        }
        for (const p of payDue) {
            if (u.settings?.notificationPayments === false) {
                break;
            }
            const d = p.dueDate;
            const isToday = d >= dayStart && d < dayEnd;
            const isTwoDay = d > now && d <= in2 && !isToday;
            if (isToday || isTwoDay) {
                await this.appNotifications.createIfNew(u._id.toString(), {
                    type: 'payment_due',
                    title: `Upcoming: ${p.title}`,
                    message: isToday
                        ? `«${p.title}» is due today (${p.amountMinor} minor).`
                        : `«${p.title}» is due soon (${p.amountMinor} minor).`,
                    scheduledAt: now
                });
            }
        }
        for (const d of debtDue) {
            if (u.settings?.notificationDebts === false) {
                break;
            }
            const name = d.personName?.trim() || d.lenderName;
            const isToday = d.dueDate >= dayStart && d.dueDate < dayEnd;
            const isTwoDay = d.dueDate > now && d.dueDate <= in2 && !isToday;
            if (isToday || isTwoDay) {
                await this.appNotifications.createIfNew(u._id.toString(), {
                    type: 'debt_due',
                    title: `Debt: ${name}`,
                    message: isToday
                        ? `Minimum or commitment for ${name} is due today.`
                        : `Upcoming due date for ${name} within 2 days.`,
                    scheduledAt: now
                });
            }
        }
        if (u.settings?.notificationUnusualSpending !== false) {
            if (prevWeekSpend > 0 && weekSpend > prevWeekSpend * 1.45) {
                await this.appNotifications.createIfNew(u._id.toString(), {
                    type: 'unusual_spending',
                    title: 'Unusual spending',
                    message: 'This week your debits are significantly higher than the prior week. Review large purchases.',
                    scheduledAt: now
                });
            }
        }
    }
    sumDebitWindow(userId, from, to) {
        return this.transactionModel
            .aggregate([
            {
                $match: {
                    userId,
                    direction: 'debit',
                    bookedAt: { $gte: from, $lte: to }
                }
            },
            { $group: { _id: null, t: { $sum: '$amountMinor' } } }
        ])
            .exec()
            .then((r) => r[0]?.t ?? 0);
    }
};
exports.NotificationSchedulerService = NotificationSchedulerService;
__decorate([
    (0, schedule_1.Cron)('15 6 * * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], NotificationSchedulerService.prototype, "runDailyReminders", null);
exports.NotificationSchedulerService = NotificationSchedulerService = NotificationSchedulerService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __param(1, (0, mongoose_1.InjectModel)(debt_schema_1.Debt.name)),
    __param(2, (0, mongoose_1.InjectModel)(transaction_schema_1.Transaction.name)),
    __param(3, (0, mongoose_1.InjectModel)(scheduled_payment_schema_1.ScheduledPayment.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        app_notifications_service_1.AppNotificationsService])
], NotificationSchedulerService);
//# sourceMappingURL=notification-scheduler.service.js.map