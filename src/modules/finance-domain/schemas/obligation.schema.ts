import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { User } from '../../users/schemas/user.schema';

export type ObligationDocument = HydratedDocument<Obligation>;

export type ObligationKind = 'loan' | 'utility' | 'subscription';

@Schema({
  collection: 'obligations',
  timestamps: true
})
export class Obligation {
  @Prop({ type: Types.ObjectId, ref: User.name, required: true, index: true })
  userId!: Types.ObjectId;

  @Prop({ required: true, enum: ['loan', 'utility', 'subscription'], index: true })
  kind!: ObligationKind;

  /** Shown in UI; can be entered in English or Eastern Armenian. */
  @Prop({ required: true, trim: true, maxlength: 200 })
  title!: string;

  @Prop({ required: true, min: 0 })
  amountDueMinor!: number;

  @Prop({ required: true, default: 'AMD' })
  currencyCode!: 'AMD';

  @Prop({ required: true })
  nextDueAt!: Date;

  @Prop({ required: true, enum: ['one_time', 'monthly', 'quarterly', 'yearly'] })
  cadence!: 'one_time' | 'monthly' | 'quarterly' | 'yearly';

  @Prop()
  utilityType?: 'gas' | 'water' | 'electricity' | 'sewer' | 'trash' | 'other';

  @Prop()
  serviceProviderName?: string;

  @Prop()
  accountReference?: string;

  @Prop({ required: true, default: false, index: true })
  pushReminderEnabled!: boolean;

  @Prop()
  fcmTokenSnapshot?: string;

  @Prop({ required: true, default: 'active', enum: ['active', 'snoozed', 'closed'] })
  status!: 'active' | 'snoozed' | 'closed';

  @Prop({ type: String, enum: ['en', 'hy'], default: 'hy' })
  labelLocale!: 'en' | 'hy';
}

export const ObligationSchema = SchemaFactory.createForClass(Obligation);

ObligationSchema.index({ userId: 1, nextDueAt: 1, kind: 1 });
