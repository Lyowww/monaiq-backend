import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import type { AppNotificationRecord } from '@ai-finance/shared-types';
import { UserPreferencesService } from '../users/user-preferences.service';
import { AppNotification, AppNotificationDocument } from './schemas/app-notification.schema';
import { FcmService } from './fcm.service';

@Injectable()
export class AppNotificationsService {
  constructor(
    @InjectModel(AppNotification.name)
    private readonly notificationModel: Model<AppNotification>,
    private readonly userPreferences: UserPreferencesService,
    private readonly fcm: FcmService
  ) {}

  map(n: AppNotificationDocument): AppNotificationRecord {
    return {
      id: n._id.toString(),
      userId: n.userId.toString(),
      type: n.type,
      title: n.title,
      message: n.message,
      scheduledAt: n.scheduledAt.toISOString(),
      isRead: n.isRead
    };
  }

  listForUser(userId: string, unreadOnly?: boolean): Promise<AppNotificationDocument[]> {
    const q: Record<string, unknown> = { userId: new Types.ObjectId(userId) };
    if (unreadOnly) {
      q.isRead = false;
    }
    return this.notificationModel.find(q).sort({ scheduledAt: -1 }).limit(100).exec();
  }

  async markRead(userId: string, id: string): Promise<AppNotificationDocument> {
    const doc = await this.notificationModel
      .findOneAndUpdate(
        { _id: new Types.ObjectId(id), userId: new Types.ObjectId(userId) },
        { isRead: true },
        { new: true }
      )
      .exec();
    if (!doc) {
      throw new NotFoundException('Notification not found');
    }
    return doc;
  }

  async createIfNew(
    userId: string,
    payload: {
      type: AppNotification['type'];
      title: string;
      message: string;
      scheduledAt: Date;
    }
  ): Promise<AppNotificationDocument | null> {
    const since = new Date(Date.now() - 36 * 60 * 60 * 1000);
    const dup = await this.notificationModel
      .findOne({
        userId: new Types.ObjectId(userId),
        type: payload.type,
        title: payload.title,
        scheduledAt: { $gte: since }
      })
      .exec();
    if (dup) {
      return null;
    }
    const [created] = await this.notificationModel.create([
      {
        userId: new Types.ObjectId(userId),
        type: payload.type,
        title: payload.title,
        message: payload.message,
        scheduledAt: payload.scheduledAt,
        isRead: false
      }
    ]);
    if (!created) {
      return null;
    }
    const target = await this.userPreferences.getPushTarget(userId);
    if (target && this.fcm.isEnabled()) {
      await this.fcm.sendToDevice(userId, target.token, payload.title, payload.message, {
        type: payload.type
      });
    }
    return created;
  }
}
