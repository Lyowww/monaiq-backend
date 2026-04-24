import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model, Types } from 'mongoose';
import { Transaction } from '../transactions/schemas/transaction.schema';
import {
  CreateScheduledPaymentDto,
  MarkPaymentPaidDto,
  UpdateScheduledPaymentDto
} from './payment.dto';
import { ScheduledPayment, ScheduledPaymentDocument } from './schemas/scheduled-payment.schema';

function addRecurrence(d: Date, type: 'weekly' | 'monthly'): Date {
  const next = new Date(d.getTime());
  if (type === 'weekly') {
    next.setUTCDate(next.getUTCDate() + 7);
    return next;
  }
  const m = next.getUTCMonth() + 1;
  next.setUTCMonth(m);
  return next;
}

@Injectable()
export class ScheduledPaymentsService {
  constructor(
    @InjectModel(ScheduledPayment.name)
    private readonly paymentModel: Model<ScheduledPayment>,
    @InjectModel(Transaction.name) private readonly transactionModel: Model<Transaction>,
    @InjectConnection() private readonly connection: Connection
  ) {}

  listForUser(userId: string): Promise<ScheduledPaymentDocument[]> {
    return this.paymentModel
      .find({ userId: new Types.ObjectId(userId) })
      .sort({ dueDate: 1 })
      .exec();
  }

  async getById(userId: string, id: string): Promise<ScheduledPaymentDocument> {
    const p = await this.paymentModel
      .findOne({ _id: new Types.ObjectId(id), userId: new Types.ObjectId(userId) })
      .exec();
    if (!p) {
      throw new NotFoundException('Payment not found');
    }
    return p;
  }

  async create(userId: string, dto: CreateScheduledPaymentDto): Promise<ScheduledPaymentDocument> {
    const [created] = await this.paymentModel.create([
      {
        userId: new Types.ObjectId(userId),
        title: dto.title.trim(),
        description: dto.description?.trim(),
        amountMinor: dto.amountMinor,
        dueDate: new Date(dto.dueDate),
        recurring: dto.recurring,
        recurrenceType: dto.recurrenceType,
        category: dto.category,
        status: 'pending',
        reminderEnabled: dto.reminderEnabled ?? true
      }
    ]);
    if (!created) {
      throw new Error('Failed to create payment');
    }
    return created;
  }

  async update(
    userId: string,
    id: string,
    dto: UpdateScheduledPaymentDto
  ): Promise<ScheduledPaymentDocument> {
    const p = await this.getById(userId, id);
    if (dto.title !== undefined) {
      p.title = dto.title;
    }
    if (dto.description !== undefined) {
      p.description = dto.description;
    }
    if (dto.amountMinor !== undefined) {
      p.amountMinor = dto.amountMinor;
    }
    if (dto.dueDate !== undefined) {
      p.dueDate = new Date(dto.dueDate);
    }
    if (dto.recurring !== undefined) {
      p.recurring = dto.recurring;
    }
    if (dto.recurrenceType !== undefined) {
      p.recurrenceType = dto.recurrenceType;
    }
    if (dto.category !== undefined) {
      p.category = dto.category;
    }
    if (dto.status !== undefined) {
      p.status = dto.status;
    }
    if (dto.reminderEnabled !== undefined) {
      p.reminderEnabled = dto.reminderEnabled;
    }
    return p.save();
  }

  async remove(userId: string, id: string): Promise<void> {
    const res = await this.paymentModel
      .deleteOne({ _id: new Types.ObjectId(id), userId: new Types.ObjectId(userId) })
      .exec();
    if (res.deletedCount === 0) {
      throw new NotFoundException('Payment not found');
    }
  }

  async markPaid(
    userId: string,
    id: string,
    dto: MarkPaymentPaidDto
  ): Promise<ScheduledPaymentDocument> {
    const session = await this.connection.startSession();
    try {
      session.startTransaction();
      const p = await this.paymentModel
        .findOne({ _id: new Types.ObjectId(id), userId: new Types.ObjectId(userId) })
        .session(session)
        .exec();
      if (!p) {
        throw new NotFoundException('Payment not found');
      }
      if (p.status === 'paid' && !p.recurring) {
        throw new BadRequestException('Payment already settled');
      }

      const payAmount = Math.min(
        dto.amountMinor ?? p.amountMinor,
        p.amountMinor
      );
      if (payAmount < 1) {
        throw new BadRequestException('Invalid amount');
      }

      await this.transactionModel.create(
        [
          {
            userId: p.userId,
            scheduledPaymentId: p._id,
            source: 'manual',
            category: p.category,
            subcategory: 'scheduled_bill',
            direction: 'debit',
            amountMinor: payAmount,
            currencyCode: 'AMD' as const,
            bookedAt: new Date(),
            merchantName: p.title,
            notes: p.description,
            isTransfer: false
          }
        ],
        { session }
      );

      if (p.recurring && p.recurrenceType !== 'none') {
        p.dueDate = addRecurrence(
          p.dueDate,
          p.recurrenceType === 'weekly' ? 'weekly' : 'monthly'
        );
        p.status = 'pending';
      } else {
        p.status = 'paid';
      }

      await p.save({ session });
      await session.commitTransaction();
      return p;
    } catch (e) {
      await session.abortTransaction();
      throw e;
    } finally {
      await session.endSession();
    }
  }
}
