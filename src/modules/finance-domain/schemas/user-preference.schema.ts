import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { User } from '../../users/schemas/user.schema';

export type UserPreferenceDocument = HydratedDocument<UserPreference>;

@Schema({
  collection: 'user_preferences',
  timestamps: true
})
export class UserPreference {
  @Prop({ type: Types.ObjectId, ref: User.name, required: true, unique: true, index: true })
  userId!: Types.ObjectId;

  @Prop({ required: true, enum: ['en', 'hy'], default: 'hy' })
  appLanguage!: 'en' | 'hy';

  @Prop({ required: true, default: false })
  ghostModeEnabled!: boolean;

  @Prop({ required: true, default: true })
  pushNotificationsEnabled!: boolean;

  @Prop()
  fcmDeviceToken?: string;

  @Prop()
  fcmTokenUpdatedAt?: Date;

  /** Net salary / periodic income anchor for “burn rate” (minor units) */
  @Prop()
  monthlySalaryAnchorMinor?: number;

  @Prop()
  lastGhostGestureAt?: Date;
}

export const UserPreferenceSchema = SchemaFactory.createForClass(UserPreference);
