import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { AiChatLog, type AiChatLogDocument } from './ai-chat-log.schema';

@Injectable()
export class AiChatLogService {
  constructor(@InjectModel(AiChatLog.name) private readonly model: Model<AiChatLogDocument>) {}

  async logUserMessage(userId: string, message: string): Promise<void> {
    const trimmed = message.trim();
    if (!trimmed) {
      return;
    }
    const preview = trimmed.length > 500 ? `${trimmed.slice(0, 500)}…` : trimmed;
    await this.model.create({
      userId: new Types.ObjectId(userId),
      messagePreview: preview,
      charCount: trimmed.length
    });
  }
}
