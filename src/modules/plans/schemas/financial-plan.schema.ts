import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { User } from '../../users/schemas/user.schema';

export type FinancialPlanDocument = HydratedDocument<FinancialPlan>;

@Schema({
  collection: 'financial_plans',
  timestamps: true
})
export class FinancialPlan {
  @Prop({ type: Types.ObjectId, ref: User.name, required: true, index: true })
  userId!: Types.ObjectId;

  @Prop({ required: true, trim: true, maxlength: 120 })
  title!: string;

  @Prop({
    required: true,
    enum: ['monthly_spend_cap', 'category_spend_cap', 'savings_target']
  })
  planType!: 'monthly_spend_cap' | 'category_spend_cap' | 'savings_target';

  @Prop({ min: 1 })
  capMinor?: number;

  @Prop({ trim: true, maxlength: 64 })
  category?: string;

  @Prop({ min: 1 })
  targetMinor?: number;

  @Prop({ min: 0, default: 0 })
  savedMinor!: number;

  @Prop({ trim: true, maxlength: 500 })
  notes?: string;

  @Prop({ required: true, default: 'active', enum: ['active', 'archived'] })
  status!: 'active' | 'archived';
}

export const FinancialPlanSchema = SchemaFactory.createForClass(FinancialPlan);

FinancialPlanSchema.index({ userId: 1, status: 1, createdAt: -1 });
