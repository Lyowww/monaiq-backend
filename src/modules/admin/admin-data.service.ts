import {
  BadRequestException,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { Model } from 'mongoose';
import { Types } from 'mongoose';
import { User, type UserDocument } from '../users/schemas/user.schema';
import { Transaction, type TransactionDocument } from '../transactions/schemas/transaction.schema';
import { Debt, type DebtDocument } from '../debts/schemas/debt.schema';
import { ScheduledPayment, type ScheduledPaymentDocument } from '../scheduled-payments/schemas/scheduled-payment.schema';
import { AiChatLog, type AiChatLogDocument } from '../ai/ai-chat-log.schema';
import { AppHomeItem, type AppHomeItemDocument } from './schemas/app-home-item.schema';
import { SubscriptionPlan, type SubscriptionPlanDocument } from './schemas/subscription-plan.schema';
import { AppNotification, type AppNotificationDocument } from '../app-notifications/schemas/app-notification.schema';
import { FinancialPlan, type FinancialPlanDocument } from '../plans/schemas/financial-plan.schema';
import { UserPreference, type UserPreferenceDocument } from '../finance-domain/schemas/user-preference.schema';
import { Obligation, type ObligationDocument } from '../finance-domain/schemas/obligation.schema';
import { CommunityBenchmark, type CommunityBenchmarkDocument } from '../finance-domain/schemas/community-benchmark.schema';
import { AiStructuredArtifact, type AiStructuredArtifactDocument } from '../finance-domain/schemas/ai-structured-artifact.schema';
import { ContactLedger, type ContactLedgerDocument } from '../finance-domain/schemas/contact-ledger.schema';
import { SavingsGoal, type SavingsGoalDocument } from '../finance-domain/schemas/savings-goal.schema';
import { Note, type NoteDocument } from '../notes/schemas/note.schema';
import { AuthSession, type AuthSessionDocument } from '../auth/schemas/auth-session.schema';

export type AdminCollectionMeta = {
  key: string;
  label: string;
  defaultSort: { field: string; direction: 1 | -1 };
};

type RegistryEntry = {
  meta: AdminCollectionMeta;
  model: Model<unknown>;
};

function toPlainJson(value: unknown): unknown {
  return JSON.parse(JSON.stringify(value));
}

function pickWritableFields(model: Model<unknown>, body: Record<string, unknown>): Record<string, unknown> {
  const paths = model.schema.paths;
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(body)) {
    if (k === '_id' || k === '__v' || k === 'id') {
      continue;
    }
    if (Object.prototype.hasOwnProperty.call(paths, k)) {
      out[k] = v;
    }
  }
  return out;
}

@Injectable()
export class AdminDataService {
  private readonly registry: Map<string, RegistryEntry>;

  constructor(
    @InjectModel(User.name) userModel: Model<UserDocument>,
    @InjectModel(Transaction.name) transactionModel: Model<TransactionDocument>,
    @InjectModel(Debt.name) debtModel: Model<DebtDocument>,
    @InjectModel(ScheduledPayment.name) scheduledPaymentModel: Model<ScheduledPaymentDocument>,
    @InjectModel(AiChatLog.name) aiChatLogModel: Model<AiChatLogDocument>,
    @InjectModel(AppHomeItem.name) appHomeItemModel: Model<AppHomeItemDocument>,
    @InjectModel(SubscriptionPlan.name) subscriptionPlanModel: Model<SubscriptionPlanDocument>,
    @InjectModel(AppNotification.name) appNotificationModel: Model<AppNotificationDocument>,
    @InjectModel(FinancialPlan.name) financialPlanModel: Model<FinancialPlanDocument>,
    @InjectModel(UserPreference.name) userPreferenceModel: Model<UserPreferenceDocument>,
    @InjectModel(Obligation.name) obligationModel: Model<ObligationDocument>,
    @InjectModel(CommunityBenchmark.name) communityBenchmarkModel: Model<CommunityBenchmarkDocument>,
    @InjectModel(AiStructuredArtifact.name) aiStructuredArtifactModel: Model<AiStructuredArtifactDocument>,
    @InjectModel(ContactLedger.name) contactLedgerModel: Model<ContactLedgerDocument>,
    @InjectModel(SavingsGoal.name) savingsGoalModel: Model<SavingsGoalDocument>,
    @InjectModel(Note.name) noteModel: Model<NoteDocument>,
    @InjectModel(AuthSession.name) authSessionModel: Model<AuthSessionDocument>
  ) {
    this.registry = new Map([
      [
        'users',
        {
          meta: {
            key: 'users',
            label: 'Users',
            defaultSort: { field: 'createdAt', direction: -1 }
          },
          model: userModel as Model<unknown>
        }
      ],
      [
        'transactions',
        {
          meta: {
            key: 'transactions',
            label: 'Transactions',
            defaultSort: { field: 'bookedAt', direction: -1 }
          },
          model: transactionModel as Model<unknown>
        }
      ],
      [
        'debts',
        {
          meta: { key: 'debts', label: 'Debts', defaultSort: { field: 'dueDate', direction: -1 } },
          model: debtModel as Model<unknown>
        }
      ],
      [
        'scheduled_payments',
        {
          meta: {
            key: 'scheduled_payments',
            label: 'Scheduled payments',
            defaultSort: { field: 'dueDate', direction: -1 }
          },
          model: scheduledPaymentModel as Model<unknown>
        }
      ],
      [
        'ai_chat_logs',
        {
          meta: {
            key: 'ai_chat_logs',
            label: 'AI chat logs',
            defaultSort: { field: 'createdAt', direction: -1 }
          },
          model: aiChatLogModel as Model<unknown>
        }
      ],
      [
        'app_home_items',
        {
          meta: {
            key: 'app_home_items',
            label: 'App home items',
            defaultSort: { field: 'sortOrder', direction: 1 }
          },
          model: appHomeItemModel as Model<unknown>
        }
      ],
      [
        'subscription_plans',
        {
          meta: {
            key: 'subscription_plans',
            label: 'Subscription plans',
            defaultSort: { field: 'sortOrder', direction: 1 }
          },
          model: subscriptionPlanModel as Model<unknown>
        }
      ],
      [
        'app_notifications',
        {
          meta: {
            key: 'app_notifications',
            label: 'App notifications',
            defaultSort: { field: 'scheduledAt', direction: -1 }
          },
          model: appNotificationModel as Model<unknown>
        }
      ],
      [
        'financial_plans',
        {
          meta: {
            key: 'financial_plans',
            label: 'Financial plans',
            defaultSort: { field: 'createdAt', direction: -1 }
          },
          model: financialPlanModel as Model<unknown>
        }
      ],
      [
        'user_preferences',
        {
          meta: {
            key: 'user_preferences',
            label: 'User preferences',
            defaultSort: { field: 'updatedAt', direction: -1 }
          },
          model: userPreferenceModel as Model<unknown>
        }
      ],
      [
        'obligations',
        {
          meta: {
            key: 'obligations',
            label: 'Obligations',
            defaultSort: { field: 'nextDueAt', direction: -1 }
          },
          model: obligationModel as Model<unknown>
        }
      ],
      [
        'community_benchmarks',
        {
          meta: {
            key: 'community_benchmarks',
            label: 'Community benchmarks',
            defaultSort: { field: 'periodMonth', direction: -1 }
          },
          model: communityBenchmarkModel as Model<unknown>
        }
      ],
      [
        'ai_structured_artifacts',
        {
          meta: {
            key: 'ai_structured_artifacts',
            label: 'AI structured artifacts',
            defaultSort: { field: 'createdAt', direction: -1 }
          },
          model: aiStructuredArtifactModel as Model<unknown>
        }
      ],
      [
        'contact_ledgers',
        {
          meta: {
            key: 'contact_ledgers',
            label: 'Contact ledgers',
            defaultSort: { field: 'lastInteractionAt', direction: -1 }
          },
          model: contactLedgerModel as Model<unknown>
        }
      ],
      [
        'savings_goals',
        {
          meta: {
            key: 'savings_goals',
            label: 'Savings goals',
            defaultSort: { field: 'createdAt', direction: -1 }
          },
          model: savingsGoalModel as Model<unknown>
        }
      ],
      [
        'notes',
        {
          meta: { key: 'notes', label: 'Notes', defaultSort: { field: 'dueDate', direction: -1 } },
          model: noteModel as Model<unknown>
        }
      ],
      [
        'auth_sessions',
        {
          meta: {
            key: 'auth_sessions',
            label: 'Auth sessions',
            defaultSort: { field: 'expiresAt', direction: -1 }
          },
          model: authSessionModel as Model<unknown>
        }
      ]
    ]);
  }

  listCollectionMeta(): { collections: AdminCollectionMeta[] } {
    return {
      collections: [...this.registry.values()].map((e) => e.meta).sort((a, b) => a.label.localeCompare(b.label))
    };
  }

  private resolve(key: string): RegistryEntry {
    const entry = this.registry.get(key);
    if (!entry) {
      throw new BadRequestException(`Unknown collection: ${key}`);
    }
    return entry;
  }

  private parseObjectId(id: string): Types.ObjectId {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid document id');
    }
    return new Types.ObjectId(id);
  }

  async listDocuments(
    collectionKey: string,
    opts: { page: number; pageSize: number }
  ): Promise<{
    collection: string;
    page: number;
    pageSize: number;
    total: number;
    items: unknown[];
  }> {
    const { model, meta } = this.resolve(collectionKey);
    const page = Math.max(1, opts.page);
    const pageSize = Math.min(200, Math.max(1, opts.pageSize));
    const skip = (page - 1) * pageSize;
    const sortField = meta.defaultSort.field;
    const sortDir = meta.defaultSort.direction;
    const sort: Record<string, 1 | -1> = { [sortField]: sortDir };
    if (sortField !== '_id') {
      sort._id = -1;
    }
    const [total, rows] = await Promise.all([
      model.countDocuments().exec(),
      model.find().sort(sort).skip(skip).limit(pageSize).lean().exec()
    ]);
    return {
      collection: collectionKey,
      page,
      pageSize,
      total,
      items: rows.map((r) => toPlainJson(r))
    };
  }

  async getDocument(collectionKey: string, id: string): Promise<unknown> {
    const { model } = this.resolve(collectionKey);
    const _id = this.parseObjectId(id);
    const row = await model.findById(_id).lean().exec();
    if (!row) {
      throw new NotFoundException();
    }
    return toPlainJson(row);
  }

  async createDocument(collectionKey: string, body: Record<string, unknown>): Promise<unknown> {
    const { model } = this.resolve(collectionKey);
    const payload = pickWritableFields(model, body);
    try {
      const created = await model.create(payload);
      const lean = await model.findById(created._id).lean().exec();
      return toPlainJson(lean);
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Create failed';
      throw new BadRequestException(msg);
    }
  }

  async patchDocument(
    collectionKey: string,
    id: string,
    body: Record<string, unknown>
  ): Promise<unknown> {
    const { model } = this.resolve(collectionKey);
    const _id = this.parseObjectId(id);
    const $set = pickWritableFields(model, body);
    if (Object.keys($set).length === 0) {
      throw new BadRequestException('No valid fields to update');
    }
    try {
      const updated = await model
        .findByIdAndUpdate(_id, { $set }, { new: true, runValidators: true })
        .lean()
        .exec();
      if (!updated) {
        throw new NotFoundException();
      }
      return toPlainJson(updated);
    } catch (e) {
      if (e instanceof NotFoundException) {
        throw e;
      }
      const msg = e instanceof Error ? e.message : 'Update failed';
      throw new BadRequestException(msg);
    }
  }

  async deleteDocument(collectionKey: string, id: string): Promise<{ success: true }> {
    const { model } = this.resolve(collectionKey);
    const _id = this.parseObjectId(id);
    const res = await model.findByIdAndDelete(_id).exec();
    if (!res) {
      throw new NotFoundException();
    }
    return { success: true as const };
  }
}
