import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model, Types } from 'mongoose';
import { Debt } from '../debts/schemas/debt.schema';
import { CreateTransactionDto } from './create-transaction.dto';
import { UpdateTransactionDto } from './update-transaction.dto';
import { Transaction, TransactionDocument } from './schemas/transaction.schema';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectModel(Transaction.name) private readonly transactionModel: Model<Transaction>,
    @InjectModel(Debt.name) private readonly debtModel: Model<Debt>,
    @InjectConnection() private readonly connection: Connection
  ) {}

  async createTransaction(userId: string, dto: CreateTransactionDto): Promise<TransactionDocument> {
    const session = await this.connection.startSession();

    try {
      session.startTransaction();

      const debt =
        dto.debtId && dto.direction === 'debit'
          ? await this.debtModel
              .findOne({
                _id: new Types.ObjectId(dto.debtId),
                userId: new Types.ObjectId(userId)
              })
              .session(session)
              .exec()
          : null;

      if (dto.debtId && !debt) {
        throw new NotFoundException('Linked debt could not be found');
      }

      const createdTransactions = await this.transactionModel.create(
        [
          {
            userId: new Types.ObjectId(userId),
            debtId: dto.debtId ? new Types.ObjectId(dto.debtId) : undefined,
            source: dto.source,
            category: dto.category,
            direction: dto.direction,
            amountMinor: dto.amountMinor,
            currencyCode: 'AMD',
            bookedAt: new Date(dto.bookedAt),
            merchantName: dto.merchantName?.trim(),
            notes: dto.notes?.trim(),
            isTransfer: dto.isTransfer ?? false,
            quickCommandRaw: dto.quickCommandRaw,
            subcategory: dto.subcategory?.trim(),
            incomeSource: dto.direction === 'credit' ? dto.incomeSource : undefined,
            recurring: dto.recurring,
            recurrenceType: dto.recurrenceType,
            pocket: dto.pocket ?? 'card'
          }
        ],
        { session }
      );

      const transaction = createdTransactions[0];
      if (!transaction) {
        throw new Error('Failed to create transaction');
      }

      if (debt) {
        debt.outstandingMinor = Math.max(0, debt.outstandingMinor - dto.amountMinor);
        debt.status = debt.outstandingMinor === 0 ? 'settled' : 'active';
        await debt.save({ session });
      }

      await session.commitTransaction();
      return transaction;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      await session.endSession();
    }
  }

  listRecent(userId: string, limit = 8): Promise<TransactionDocument[]> {
    return this.transactionModel
      .find({ userId: new Types.ObjectId(userId) })
      .sort({ bookedAt: -1 })
      .limit(limit)
      .exec();
  }

  listFiltered(
    userId: string,
    options: {
      type?: 'expense' | 'income';
      category?: string;
      q?: string;
      limit: number;
      skip: number;
    }
  ): Promise<TransactionDocument[]> {
    const match: Record<string, unknown> = { userId: new Types.ObjectId(userId) };
    if (options.type === 'expense') {
      match.direction = 'debit';
    } else if (options.type === 'income') {
      match.direction = 'credit';
    }
    if (options.category) {
      match.category = new RegExp(`^${escapeRegex(options.category)}$`, 'i');
    }
    if (options.q) {
      const r = new RegExp(escapeRegex(options.q), 'i');
      match.$or = [{ merchantName: r }, { notes: r }, { category: r }];
    }
    return this.transactionModel
      .find(match)
      .sort({ bookedAt: -1 })
      .skip(options.skip)
      .limit(options.limit)
      .exec();
  }

  async updateTransaction(
    userId: string,
    id: string,
    dto: UpdateTransactionDto
  ): Promise<TransactionDocument> {
    const t = await this.transactionModel
      .findOne({ _id: new Types.ObjectId(id), userId: new Types.ObjectId(userId) })
      .exec();
    if (!t) {
      throw new NotFoundException('Transaction not found');
    }
    if (dto.source !== undefined) {
      t.source = dto.source;
    }
    if (dto.category !== undefined) {
      t.category = dto.category;
    }
    if (dto.subcategory !== undefined) {
      t.subcategory = dto.subcategory;
    }
    if (dto.amountMinor !== undefined) {
      t.amountMinor = dto.amountMinor;
    }
    if (dto.bookedAt !== undefined) {
      t.bookedAt = new Date(dto.bookedAt);
    }
    if (dto.merchantName !== undefined) {
      t.merchantName = dto.merchantName;
    }
    if (dto.notes !== undefined) {
      t.notes = dto.notes;
    }
    if (dto.incomeSource !== undefined) {
      t.incomeSource = dto.incomeSource;
    }
    if (dto.recurring !== undefined) {
      t.recurring = dto.recurring;
    }
    if (dto.recurrenceType !== undefined) {
      t.recurrenceType = dto.recurrenceType;
    }
    return t.save();
  }

  async deleteTransaction(userId: string, id: string): Promise<void> {
    const res = await this.transactionModel
      .deleteOne({ _id: new Types.ObjectId(id), userId: new Types.ObjectId(userId) })
      .exec();
    if (res.deletedCount === 0) {
      throw new NotFoundException('Transaction not found');
    }
  }
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
