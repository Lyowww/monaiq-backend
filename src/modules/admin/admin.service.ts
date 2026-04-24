import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, type UserDocument } from '../users/schemas/user.schema';
import { Transaction, type TransactionDocument } from '../transactions/schemas/transaction.schema';
import { AiChatLog, type AiChatLogDocument } from '../ai/ai-chat-log.schema';
import { AppHomeItem, type AppHomeItemDocument } from './schemas/app-home-item.schema';

const BUILTIN_HOME: Array<{
  key: string;
  titleHy: string;
  titleEn: string;
  subtitleHy: string;
  subtitleEn: string;
  route: string;
  iconName: string;
  sortOrder: number;
}> = [
  {
    key: 'analytics',
    titleHy: 'Վերլուծություն',
    titleEn: 'Analytics',
    subtitleHy: 'Ծախս, մուտք, կատեգորիա',
    subtitleEn: 'Spending, inflow, categories',
    route: '/(app)/(tabs)/stats',
    iconName: 'stats-chart',
    sortOrder: 0
  },
  {
    key: 'assistant',
    titleHy: 'Օգնական',
    titleEn: 'Assistant',
    subtitleHy: 'Կանոնավոր ֆինանս հարցեր',
    subtitleEn: 'Budget and cash questions',
    route: '/(app)/(tabs)/assistant',
    iconName: 'chatbubble-ellipses',
    sortOrder: 1
  }
];

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(Transaction.name) private readonly txModel: Model<TransactionDocument>,
    @InjectModel(AiChatLog.name) private readonly aiLogModel: Model<AiChatLogDocument>,
    @InjectModel(AppHomeItem.name) private readonly homeItemModel: Model<AppHomeItemDocument>
  ) {}

  async dashboardSummary() {
    const [users, txCount, aiLogs, lastTx] = await Promise.all([
      this.userModel.countDocuments().exec(),
      this.txModel.countDocuments().exec(),
      this.aiLogModel.countDocuments().exec(),
      this.txModel.findOne().sort({ _id: -1 }).lean().exec()
    ]);

    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    const aiToday = await this.aiLogModel
      .countDocuments({ createdAt: { $gte: today } })
      .exec();

    const created = lastTx as { createdAt?: Date; bookedAt?: Date } | null;
    const lastAt = created?.createdAt ?? (created && 'bookedAt' in created ? (created.bookedAt as Date | undefined) : undefined);
    return {
      users,
      transactions: txCount,
      aiChatMessages: aiLogs,
      aiChatMessagesToday: aiToday,
      lastActivityAt: lastAt ? new Date(lastAt).toISOString() : null
    };
  }

  async listAiLogs(limit: number) {
    const n = Math.min(200, Math.max(1, limit));
    const rows = await this.aiLogModel
      .find()
      .sort({ createdAt: -1 })
      .limit(n)
      .lean()
      .exec();
    return rows.map((r) => {
      const o = r as {
        _id: Types.ObjectId;
        userId: Types.ObjectId;
        messagePreview: string;
        charCount: number;
        createdAt?: Date;
      };
      return {
        id: o._id.toString(),
        userId: o.userId.toString(),
        messagePreview: o.messagePreview,
        charCount: o.charCount,
        createdAt: (o.createdAt ?? new Date(0)).toISOString()
      };
    });
  }

  async listHomeItemsResolved() {
    return this.mergedHomeItems();
  }

  private async mergedHomeItems() {
    const db = await this.homeItemModel.find().sort({ sortOrder: 1 }).lean().exec();
    if (db.length > 0) {
      return db.map((d) => ({
        id: d._id.toString(),
        key: d.key,
        titleHy: d.titleHy,
        titleEn: d.titleEn,
        subtitleHy: d.subtitleHy,
        subtitleEn: d.subtitleEn,
        route: d.route,
        iconName: d.iconName,
        sortOrder: d.sortOrder,
        enabled: d.enabled
      }));
    }
    return BUILTIN_HOME.map((b, i) => ({
      id: `builtin-${b.key}`,
      key: b.key,
      titleHy: b.titleHy,
      titleEn: b.titleEn,
      subtitleHy: b.subtitleHy,
      subtitleEn: b.subtitleEn,
      route: b.route,
      iconName: b.iconName,
      sortOrder: b.sortOrder ?? i,
      enabled: true
    }));
  }

  adminListHome() {
    return this.homeItemModel.find().sort({ sortOrder: 1 }).lean().exec();
  }

  async createHomeItem(body: {
    key: string;
    titleHy: string;
    titleEn: string;
    subtitleHy: string;
    subtitleEn: string;
    route: string;
    iconName?: string;
    sortOrder?: number;
    enabled?: boolean;
  }) {
    const created = await this.homeItemModel.create({
      key: body.key.trim(),
      titleHy: body.titleHy,
      titleEn: body.titleEn,
      subtitleHy: body.subtitleHy,
      subtitleEn: body.subtitleEn,
      route: body.route,
      iconName: body.iconName ?? 'sparkles',
      sortOrder: body.sortOrder ?? 0,
      enabled: body.enabled !== false
    });
    return created;
  }

  async patchHomeItem(
    id: string,
    patch: Partial<{
      titleHy: string;
      titleEn: string;
      subtitleHy: string;
      subtitleEn: string;
      route: string;
      iconName: string;
      sortOrder: number;
      enabled: boolean;
    }>
  ) {
    const doc = await this.homeItemModel
      .findByIdAndUpdate(new Types.ObjectId(id), { $set: patch }, { new: true })
      .exec();
    if (!doc) {
      throw new NotFoundException();
    }
    return doc;
  }

  async deleteHomeItem(id: string) {
    const res = await this.homeItemModel.findByIdAndDelete(new Types.ObjectId(id)).exec();
    if (!res) {
      throw new NotFoundException();
    }
    return { success: true as const };
  }
}
