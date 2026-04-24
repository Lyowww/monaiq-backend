import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { UserPreference, UserPreferenceDocument } from '../finance-domain/schemas/user-preference.schema';

@Injectable()
export class UserPreferencesService {
  constructor(
    @InjectModel(UserPreference.name) private readonly prefModel: Model<UserPreferenceDocument>
  ) {}

  async setFcmToken(userId: string, token: string, pushEnabled?: boolean): Promise<void> {
    const setFields: Record<string, unknown> = {
      fcmDeviceToken: token.trim(),
      fcmTokenUpdatedAt: new Date()
    };
    if (typeof pushEnabled === 'boolean') {
      setFields.pushNotificationsEnabled = pushEnabled;
    }
    await this.prefModel
      .findOneAndUpdate(
        { userId: new Types.ObjectId(userId) },
        {
          $set: setFields,
          $setOnInsert: {
            userId: new Types.ObjectId(userId),
            appLanguage: 'hy',
            ghostModeEnabled: false,
            pushNotificationsEnabled: true
          }
        },
        { upsert: true }
      )
      .exec();
  }

  async getPushTarget(userId: string): Promise<{ token: string } | null> {
    const doc = await this.prefModel.findOne({ userId: new Types.ObjectId(userId) }).exec();
    if (!doc?.fcmDeviceToken?.trim()) {
      return null;
    }
    if (doc.pushNotificationsEnabled === false) {
      return null;
    }
    return { token: doc.fcmDeviceToken.trim() };
  }

  async clearFcmDeviceToken(userId: string): Promise<void> {
    await this.prefModel
      .updateOne(
        { userId: new Types.ObjectId(userId) },
        { $unset: { fcmDeviceToken: 1, fcmTokenUpdatedAt: 1 } }
      )
      .exec();
  }
}
