import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { User } from '../../users/schemas/user.schema';

export type AppNotificationDocument = HydratedDocument<AppNotification>;

@Schema({
  collection: 'app_notifications',
  timestamps: true
})
export class AppNotification {
  @Prop({ type: Types.ObjectId, ref: User.name, required: true, index: true })
  userId!: Types.ObjectId;

  @Prop({
    required: true,
    enum: ['payment_due', 'debt_due', 'low_balance', 'unusual_spending', 'insight', 'general']
  })
  type!: 'payment_due' | 'debt_due' | 'low_balance' | 'unusual_spending' | 'insight' | 'general';

  @Prop({ required: true, trim: true })
  title!: string;

  @Prop({ required: true, trim: true })
  message!: string;

  @Prop({ required: true })
  scheduledAt!: Date;

  @Prop({ required: true, default: false })
  isRead!: boolean;
}

export const AppNotificationSchema = SchemaFactory.createForClass(AppNotification);

AppNotificationSchema.index({ userId: 1, scheduledAt: -1 });
AppNotificationSchema.index({ userId: 1, isRead: 1 });
