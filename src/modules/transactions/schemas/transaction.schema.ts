import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Debt } from '../../debts/schemas/debt.schema';
import { User } from '../../users/schemas/user.schema';

export type TransactionDocument = HydratedDocument<Transaction>;

@Schema({
  collection: 'transactions',
  timestamps: true
})
export class Transaction {
  @Prop({ type: Types.ObjectId, ref: User.name, required: true, index: true })
  userId!: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: Debt.name })
  debtId?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Obligation' })
  obligationId?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'ScheduledPayment' })
  scheduledPaymentId?: Types.ObjectId;

  @Prop({ required: true, enum: ['manual', 'ocr', 'voice', 'bank_sync', 'suggestion'] })
  source!: 'manual' | 'ocr' | 'voice' | 'bank_sync' | 'suggestion';

  @Prop({ required: true, trim: true })
  category!: string;

  @Prop({ trim: true })
  subcategory?: string;

  @Prop({ required: true, enum: ['credit', 'debit'] })
  direction!: 'credit' | 'debit';

  @Prop({ required: true, min: 1 })
  amountMinor!: number;

  @Prop({ required: true, default: 'AMD' })
  currencyCode!: 'AMD';

  @Prop({ required: true })
  bookedAt!: Date;

  @Prop({ trim: true })
  merchantName?: string;

  @Prop({ trim: true })
  notes?: string;

  @Prop({ required: true, default: false })
  isTransfer!: boolean;

  @Prop()
  quickCommandRaw?: string;

  @Prop({ enum: ['salary', 'freelance', 'gift', 'other'] })
  incomeSource?: 'salary' | 'freelance' | 'gift' | 'other';

  @Prop()
  recurring?: boolean;

  @Prop({ enum: ['none', 'monthly', 'weekly'] })
  recurrenceType?: 'none' | 'monthly' | 'weekly';

  /** When absent, analytics treat the row as card (matches legacy data). */
  @Prop({ enum: ['cash', 'card'] })
  pocket?: 'cash' | 'card';
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);

TransactionSchema.index({ userId: 1, bookedAt: -1 });
