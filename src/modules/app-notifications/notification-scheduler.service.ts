import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Cron } from '@nestjs/schedule';
import { User, UserDocument } from '../users/schemas/user.schema';
import { Debt, DebtDocument } from '../debts/schemas/debt.schema';
import { Transaction } from '../transactions/schemas/transaction.schema';
import { ScheduledPayment, ScheduledPaymentDocument } from '../scheduled-payments/schemas/scheduled-payment.schema';
import { AppNotificationsService } from './app-notifications.service';

function startOfUtcDay(d: Date): Date {
  const x = new Date(d.getTime());
  x.setUTCHours(0, 0, 0, 0);
  return x;
}

@Injectable()
export class NotificationSchedulerService {
  private readonly logger = new Logger(NotificationSchedulerService.name);

  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Debt.name) private readonly debtModel: Model<Debt>,
    @InjectModel(Transaction.name) private readonly transactionModel: Model<Transaction>,
    @InjectModel(ScheduledPayment.name) private readonly paymentModel: Model<ScheduledPayment>,
    private readonly appNotifications: AppNotificationsService
  ) {}

  @Cron('15 6 * * *')
  async runDailyReminders(): Promise<void> {
    try {
      const users = await this.userModel.find().limit(500).exec();
      for (const u of users) {
        try {
          await this.evaluateUser(u);
        } catch (e) {
          const m = e instanceof Error ? e.message : String(e);
          this.logger.warn(`Notification pass failed for ${u._id.toString()}: ${m}`);
        }
      }
    } catch (e) {
      const m = e instanceof Error ? e.message : String(e);
      this.logger.error(`Notification batch failed: ${m}`);
    }
  }

  /** Used by internal cron HTTP as well */
  async evaluateUser(u: UserDocument): Promise<void> {
    const uid = u._id as Types.ObjectId;
    const threshold = u.settings?.lowBalanceThresholdMinor ?? 0;
    const now = new Date();
    const in2 = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000);
    const dayStart = startOfUtcDay(now);
    const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000);

    const thisWeekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const prevWeekStart = new Date(thisWeekStart.getTime() - 7 * 24 * 60 * 60 * 1000);

    const [balanceDocs, payDue, debtDue, weekSpend, prevWeekSpend] = await Promise.all([
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

  private sumDebitWindow(userId: Types.ObjectId, from: Date, to: Date): Promise<number> {
    return this.transactionModel
      .aggregate<{ t: number }>([
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
}
