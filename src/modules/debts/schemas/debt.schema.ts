import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { User } from '../../users/schemas/user.schema';

export type DebtDocument = HydratedDocument<Debt>;

@Schema({
  collection: 'debts',
  timestamps: true
})
export class Debt {
  @Prop({ type: Types.ObjectId, ref: User.name, required: true, index: true })
  userId!: Types.ObjectId;

  @Prop({ required: true, trim: true })
  lenderName!: string;

  @Prop({ trim: true })
  personName?: string;

  @Prop({ required: true, default: 'I_OWE', enum: ['I_OWE', 'THEY_OWE'] })
  debtType!: 'I_OWE' | 'THEY_OWE';

  @Prop({ trim: true })
  reason?: string;

  @Prop({ required: true, default: true })
  reminderEnabled!: boolean;

  @Prop({ required: true, min: 1 })
  principalMinor!: number;

  @Prop({ required: true, min: 0 })
  outstandingMinor!: number;

  @Prop({ required: true, min: 0 })
  minimumDueMinor!: number;

  @Prop({ required: true, min: 0 })
  aprPercent!: number;

  @Prop({ required: true })
  dueDate!: Date;

  @Prop({ required: true, enum: ['family', 'friend', 'bank', 'fintech', 'other'] })
  relationship!: 'family' | 'friend' | 'bank' | 'fintech' | 'other';

  @Prop({ required: true, default: 'active', enum: ['active', 'settled', 'defaulted'] })
  status!: 'active' | 'settled' | 'defaulted';
}

export const DebtSchema = SchemaFactory.createForClass(Debt);

DebtSchema.index({ userId: 1, dueDate: 1 });
