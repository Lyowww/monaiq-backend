import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type AiChatLogDocument = HydratedDocument<AiChatLog>;

@Schema({ collection: 'ai_chat_logs', timestamps: { createdAt: true, updatedAt: false } })
export class AiChatLog {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  userId!: Types.ObjectId;

  @Prop({ required: true, maxlength: 2000 })
  messagePreview!: string;

  @Prop({ required: true })
  charCount!: number;
}

export const AiChatLogSchema = SchemaFactory.createForClass(AiChatLog);
AiChatLogSchema.index({ createdAt: -1 });
