import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type AiFinanceConversationDocument = HydratedDocument<AiFinanceConversation>;

@Schema({ _id: false })
export class FinanceChatTurn {
  @Prop({ required: true, enum: ['user', 'assistant'] })
  role!: 'user' | 'assistant';

  @Prop({ required: true, maxlength: 32000 })
  content!: string;

  @Prop({ type: Date, default: () => new Date() })
  at!: Date;
}

const FinanceChatTurnSchema = SchemaFactory.createForClass(FinanceChatTurn);

@Schema({ collection: 'ai_finance_conversations', timestamps: true })
export class AiFinanceConversation {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  userId!: Types.ObjectId;

  @Prop({ required: true, maxlength: 200 })
  title!: string;

  @Prop({ type: [FinanceChatTurnSchema], default: [] })
  messages!: FinanceChatTurn[];
}

export const AiFinanceConversationSchema = SchemaFactory.createForClass(AiFinanceConversation);
AiFinanceConversationSchema.index({ userId: 1, updatedAt: -1 });
