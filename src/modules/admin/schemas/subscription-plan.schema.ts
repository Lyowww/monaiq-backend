import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type SubscriptionPlanDocument = HydratedDocument<SubscriptionPlan>;

@Schema({
  collection: 'subscription_plans',
  timestamps: true
})
export class SubscriptionPlan {
  @Prop({ required: true, unique: true, trim: true, lowercase: true })
  key!: string;

  @Prop({ required: true, trim: true })
  name!: string;

  @Prop({ trim: true })
  description?: string;

  /** Price in minor units (e.g. dram cents or whole AMD depending on product convention). */
  @Prop({ required: true, min: 0 })
  priceMinor!: number;

  @Prop({ required: true, enum: ['AMD', 'USD', 'EUR'], default: 'AMD' })
  currencyCode!: 'AMD' | 'USD' | 'EUR';

  @Prop({ required: true, enum: ['month', 'year'], default: 'month' })
  billingPeriod!: 'month' | 'year';

  @Prop({ type: [String], default: [] })
  featureIds!: string[];

  @Prop({ default: 0 })
  sortOrder!: number;

  @Prop({ default: true })
  isActive!: boolean;

  /** Short label shown on cards, e.g. "Popular". */
  @Prop({ trim: true })
  highlightTag?: string;
}

export const SubscriptionPlanSchema = SchemaFactory.createForClass(SubscriptionPlan);

SubscriptionPlanSchema.index({ sortOrder: 1, key: 1 });
