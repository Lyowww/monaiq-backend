import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types, Schema as MongooseSchema } from 'mongoose';
import { User } from '../../users/schemas/user.schema';

export type AiStructuredArtifactDocument = HydratedDocument<AiStructuredArtifact>;

@Schema({
  collection: 'ai_structured_artifacts',
  timestamps: true
})
export class AiStructuredArtifact {
  @Prop({ type: Types.ObjectId, ref: User.name, required: true, index: true })
  userId!: Types.ObjectId;

  @Prop({
    required: true,
    enum: [
      'income_nudge',
      'cash_runway',
      'savings_coach',
      'utility_benchmark',
      'debt_sms_draft',
      'general'
    ],
    index: true
  })
  kind!:
    | 'income_nudge'
    | 'cash_runway'
    | 'savings_coach'
    | 'utility_benchmark'
    | 'debt_sms_draft'
    | 'general';

  @Prop({ required: true, min: 1 })
  schemaVersion!: number;

  @Prop({ type: MongooseSchema.Types.Mixed, required: true })
  /** Strict JSON from the LLM; versioned with schemaVersion. */
  payload!: Record<string, unknown>;

  @Prop()
  idempotencyKey?: string;
}

export const AiStructuredArtifactSchema = SchemaFactory.createForClass(AiStructuredArtifact);

AiStructuredArtifactSchema.index({ userId: 1, kind: 1, createdAt: -1 });
AiStructuredArtifactSchema.index({ idempotencyKey: 1 }, { unique: true, sparse: true });
