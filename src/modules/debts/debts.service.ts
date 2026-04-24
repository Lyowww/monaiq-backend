import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Debt, DebtDocument } from './schemas/debt.schema';
import { CreateDebtDto, UpdateDebtDto } from './debt.dto';

@Injectable()
export class DebtsService {
  constructor(@InjectModel(Debt.name) private readonly debtModel: Model<Debt>) {}

  async listForUser(userId: string, debtType?: 'I_OWE' | 'THEY_OWE'): Promise<DebtDocument[]> {
    const filter: Record<string, unknown> = { userId: new Types.ObjectId(userId) };
    if (debtType) {
      filter.debtType = debtType;
    }
    return this.debtModel.find(filter).sort({ dueDate: 1 }).exec();
  }

  async getById(userId: string, id: string): Promise<DebtDocument> {
    const doc = await this.debtModel
      .findOne({ _id: new Types.ObjectId(id), userId: new Types.ObjectId(userId) })
      .exec();
    if (!doc) {
      throw new NotFoundException('Debt not found');
    }
    return doc;
  }

  async create(userId: string, dto: CreateDebtDto): Promise<DebtDocument> {
    const person = dto.personName.trim();
    const [created] = await this.debtModel.create([
      {
        userId: new Types.ObjectId(userId),
        lenderName: person,
        personName: person,
        debtType: dto.debtType ?? 'I_OWE',
        reason: dto.reason,
        reminderEnabled: dto.reminderEnabled ?? true,
        principalMinor: dto.principalMinor,
        outstandingMinor: dto.outstandingMinor ?? dto.principalMinor,
        minimumDueMinor: dto.minimumDueMinor,
        aprPercent: dto.aprPercent,
        dueDate: new Date(dto.dueDate),
        relationship: dto.relationship,
        status: 'active'
      }
    ]);
    if (!created) {
      throw new Error('Failed to create debt');
    }
    return created;
  }

  async update(userId: string, id: string, dto: UpdateDebtDto): Promise<DebtDocument> {
    const existing = await this.getById(userId, id);
    if (dto.personName !== undefined || dto.lenderName !== undefined) {
      const p = (dto.personName ?? dto.lenderName)?.trim();
      if (p) {
        existing.lenderName = p;
        existing.personName = p;
      }
    }
    if (dto.debtType !== undefined) {
      existing.debtType = dto.debtType;
    }
    if (dto.reason !== undefined) {
      existing.reason = dto.reason;
    }
    if (dto.reminderEnabled !== undefined) {
      existing.reminderEnabled = dto.reminderEnabled;
    }
    if (dto.principalMinor !== undefined) {
      existing.principalMinor = dto.principalMinor;
    }
    if (dto.outstandingMinor !== undefined) {
      existing.outstandingMinor = dto.outstandingMinor;
    }
    if (dto.minimumDueMinor !== undefined) {
      existing.minimumDueMinor = dto.minimumDueMinor;
    }
    if (dto.aprPercent !== undefined) {
      existing.aprPercent = dto.aprPercent;
    }
    if (dto.dueDate !== undefined) {
      existing.dueDate = new Date(dto.dueDate);
    }
    if (dto.relationship !== undefined) {
      existing.relationship = dto.relationship;
    }
    if (dto.status !== undefined) {
      existing.status = dto.status;
    }
    return existing.save();
  }

  async remove(userId: string, id: string): Promise<void> {
    const res = await this.debtModel
      .deleteOne({ _id: new Types.ObjectId(id), userId: new Types.ObjectId(userId) })
      .exec();
    if (res.deletedCount === 0) {
      throw new NotFoundException('Debt not found');
    }
  }
}
