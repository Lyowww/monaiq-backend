import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { AiFinanceConversation, type AiFinanceConversationDocument } from './ai-finance-conversation.schema';

export type FinanceChatTurnDto = { role: 'user' | 'assistant'; content: string; at: string };

@Injectable()
export class AiFinanceConversationService {
  constructor(
    @InjectModel(AiFinanceConversation.name) private readonly model: Model<AiFinanceConversationDocument>
  ) {}

  previewTitle(message: string): string {
    const t = message.trim();
    if (t.length <= 100) {
      return t;
    }
    return `${t.slice(0, 100)}…`;
  }

  async create(userId: string, title: string): Promise<AiFinanceConversationDocument> {
    return this.model.create({
      userId: new Types.ObjectId(userId),
      title,
      messages: []
    });
  }

  async requireForUser(userId: string, conversationId: string): Promise<AiFinanceConversationDocument> {
    if (!Types.ObjectId.isValid(conversationId)) {
      throw new NotFoundException('Conversation not found');
    }
    const doc = await this.model
      .findOne({
        _id: new Types.ObjectId(conversationId),
        userId: new Types.ObjectId(userId)
      })
      .exec();
    if (!doc) {
      throw new NotFoundException('Conversation not found');
    }
    return doc;
  }

  async listSummaries(
    userId: string,
    limit = 40
  ): Promise<{ id: string; title: string; updatedAt: string }[]> {
    const rows = await this.model
      .find({ userId: new Types.ObjectId(userId) })
      .sort({ updatedAt: -1 })
      .limit(limit)
      .select({ title: 1, updatedAt: 1 })
      .lean()
      .exec();
    return rows.map((r) => {
      const row = r as typeof r & { updatedAt?: Date; createdAt?: Date };
      const d = row.updatedAt ?? row.createdAt ?? new Date();
      return {
        id: String(r._id),
        title: r.title,
        updatedAt: d.toISOString()
      };
    });
  }

  async getWithTurns(userId: string, conversationId: string): Promise<{
    id: string;
    title: string;
    updatedAt: string;
    messages: FinanceChatTurnDto[];
  }> {
    const doc = await this.requireForUser(userId, conversationId);
    const docAny = doc as AiFinanceConversationDocument & { updatedAt?: Date; createdAt?: Date };
    const updatedAt = docAny.updatedAt ?? docAny.createdAt ?? new Date();
    return {
      id: doc._id.toString(),
      title: doc.title,
      updatedAt: updatedAt.toISOString(),
      messages: doc.messages.map((m) => ({
        role: m.role,
        content: m.content,
        at: m.at.toISOString()
      }))
    };
  }

  async appendUserAssistantPair(
    conversationId: Types.ObjectId,
    userContent: string,
    assistantContent: string
  ): Promise<void> {
    const now = new Date();
    await this.model.updateOne(
      { _id: conversationId },
      {
        $push: {
          messages: {
            $each: [
              { role: 'user', content: userContent, at: now },
              { role: 'assistant', content: assistantContent, at: now }
            ]
          }
        },
        $set: { updatedAt: now }
      }
    );
  }
}
