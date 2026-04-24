import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import type { UserProfile, UserSettings } from '@ai-finance/shared-types';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({
  collection: 'users',
  timestamps: true
})
export class User {
  @Prop({ required: true, unique: true, lowercase: true, trim: true, index: true })
  email!: string;

  @Prop({ required: true })
  passwordHash!: string;

  @Prop({ required: true, trim: true })
  firstName!: string;

  @Prop({ required: true, trim: true })
  lastName!: string;

  @Prop({ required: true, default: 'AMD', enum: ['AMD', 'USD', 'EUR'] })
  currencyCode!: 'AMD' | 'USD' | 'EUR';

  @Prop({ required: true, default: 'hy-AM' })
  locale!: string;

  @Prop({ required: true })
  dateOfBirth!: Date;

  @Prop({ required: true, default: false })
  isEmailVerified!: boolean;

  @Prop({ required: true, default: false })
  isAdmin!: boolean;

  @Prop()
  lastInsightAt?: Date;

  /** Notification + assistant preferences; defaults align with fintech spec */
  @Prop({
    type: {
      lowBalanceThresholdMinor: { type: Number, default: 0 },
      notificationPayments: { type: Boolean, default: true },
      notificationDebts: { type: Boolean, default: true },
      notificationLowBalance: { type: Boolean, default: true },
      notificationUnusualSpending: { type: Boolean, default: true },
      subscription: { type: String, enum: ['free', 'premium'], default: 'free' },
      subscriptionPlanKey: { type: String, trim: true, lowercase: true }
    },
    _id: false,
    default: () => ({
      lowBalanceThresholdMinor: 0,
      notificationPayments: true,
      notificationDebts: true,
      notificationLowBalance: true,
      notificationUnusualSpending: true,
      subscription: 'free' as const
    })
  })
  settings?: {
    lowBalanceThresholdMinor: number;
    notificationPayments: boolean;
    notificationDebts: boolean;
    notificationLowBalance: boolean;
    notificationUnusualSpending: boolean;
    subscription: 'free' | 'premium';
    subscriptionPlanKey?: string;
  };
}

export const UserSchema = SchemaFactory.createForClass(User);

function toUserSettings(
  s:
    | {
        lowBalanceThresholdMinor?: number;
        notificationPayments?: boolean;
        notificationDebts?: boolean;
        notificationLowBalance?: boolean;
        notificationUnusualSpending?: boolean;
        subscription?: 'free' | 'premium';
        subscriptionPlanKey?: string;
      }
    | undefined
): UserSettings {
  return {
    lowBalanceThresholdMinor: s?.lowBalanceThresholdMinor ?? 0,
    notificationPayments: s?.notificationPayments ?? true,
    notificationDebts: s?.notificationDebts ?? true,
    notificationLowBalance: s?.notificationLowBalance ?? true,
    notificationUnusualSpending: s?.notificationUnusualSpending ?? true,
    subscription: s?.subscription ?? 'free',
    subscriptionPlanKey: s?.subscriptionPlanKey ?? null
  };
}

export function toUserProfile(user: UserDocument, includeSettings = false): UserProfile {
  const base: UserProfile = {
    id: user._id.toString(),
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    currencyCode: user.currencyCode,
    locale: user.locale,
    dateOfBirth: user.dateOfBirth.toISOString(),
    isEmailVerified: user.isEmailVerified,
    isAdmin: user.isAdmin === true
  };

  if (includeSettings) {
    return { ...base, settings: toUserSettings(user.settings) };
  }

  return base;
}
