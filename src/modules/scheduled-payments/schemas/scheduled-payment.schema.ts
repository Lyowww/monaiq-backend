import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { User } from '../../users/schemas/user.schema';

export type ScheduledPaymentDocument = HydratedDocument<ScheduledPayment>;

@Schema({
  collection: 'scheduled_payments',
  timestamps: true
})
export class ScheduledPayment {
  @Prop({ type: Types.ObjectId, ref: User.name, required: true, index: true })
  userId!: Types.ObjectId;

  @Prop({ required: true, trim: true })
  title!: string;

  @Prop({ trim: true })
  description?: string;

  @Prop({ required: true, min: 1 })
  amountMinor!: number;

  @Prop({ required: true })
  dueDate!: Date;

  @Prop({ required: true, default: false })
  recurring!: boolean;

  @Prop({ required: true, default: 'none', enum: ['none', 'weekly', 'monthly'] })
  recurrenceType!: 'none' | 'weekly' | 'monthly';

  @Prop({
    required: true,
    default: 'other',
    enum: ['utilities', 'subscription', 'rent', 'other']
  })
  category!: 'utilities' | 'subscription' | 'rent' | 'other';

  @Prop({ required: true, default: 'pending', enum: ['pending', 'paid'] })
  status!: 'pending' | 'paid';

  @Prop({ required: true, default: true })
  reminderEnabled!: boolean;
}

export const ScheduledPaymentSchema = SchemaFactory.createForClass(ScheduledPayment);

ScheduledPaymentSchema.index({ userId: 1, dueDate: 1 });
ScheduledPaymentSchema.index({ userId: 1, status: 1, dueDate: 1 });
