import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { User } from '../../users/schemas/user.schema';

export type ContactLedgerDocument = HydratedDocument<ContactLedger>;

@Schema({
  collection: 'contact_ledgers',
  timestamps: true
})
export class ContactLedger {
  @Prop({ type: Types.ObjectId, ref: User.name, required: true, index: true })
  userId!: Types.ObjectId;

  @Prop({ required: true, trim: true, maxlength: 200 })
  contactDisplayName!: string;

  @Prop()
  contactPhoneE164?: string;

  @Prop()
  lastInteractionAt?: Date;

  @Prop({ required: true, default: 0, min: 0 })
  contactFrequencyScore!: number;

  @Prop({ required: true, min: 1 })
  amountMinor!: number;

  @Prop({ required: true, default: 'AMD' })
  currencyCode!: 'AMD';

  @Prop({ required: true, enum: ['borrowed', 'lent'] })
  direction!: 'borrowed' | 'lent';

  @Prop({ required: true, default: 'open', enum: ['open', 'settled', 'disputed'] })
  status!: 'open' | 'settled' | 'disputed';

  @Prop()
  lastReminderAt?: Date;

  @Prop({ default: 0, min: 0 })
  reminderCount!: number;

  @Prop()
  lastReminderMessageHy?: string;

  @Prop()
  lastReminderMessageEn?: string;
}

export const ContactLedgerSchema = SchemaFactory.createForClass(ContactLedger);

ContactLedgerSchema.index({ userId: 1, contactDisplayName: 1 });
ContactLedgerSchema.index({ userId: 1, status: 1, lastInteractionAt: -1 });
