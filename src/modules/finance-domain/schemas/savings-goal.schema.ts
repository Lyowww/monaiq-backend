import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { User } from '../../users/schemas/user.schema';

export type SavingsGoalDocument = HydratedDocument<SavingsGoal>;

@Schema({
  collection: 'savings_goals',
  timestamps: true
})
export class SavingsGoal {
  @Prop({ type: Types.ObjectId, ref: User.name, required: true, index: true })
  userId!: Types.ObjectId;

  @Prop({ required: true, trim: true, maxlength: 200 })
  title!: string;

  @Prop({ required: true, min: 1 })
  targetMinor!: number;

  @Prop({ required: true, default: 'AMD' })
  currencyCode!: 'AMD';

  @Prop()
  targetAt?: Date;

  @Prop({ min: 0, default: 0 })
  savedMinor!: number;

  /** AI “safe to save” nudge, minor units, optional */
  @Prop()
  safeToSaveMinor?: number;

  @Prop()
  lastCoachAdviceAt?: Date;

  @Prop({ required: true, default: 'active', enum: ['active', 'completed', 'archived'] })
  status!: 'active' | 'completed' | 'archived';
}

export const SavingsGoalSchema = SchemaFactory.createForClass(SavingsGoal);

SavingsGoalSchema.index({ userId: 1, status: 1, createdAt: -1 });
