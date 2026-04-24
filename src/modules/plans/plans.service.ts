import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateFinancialPlanDto, UpdateFinancialPlanDto } from './plan.dto';
import { mapFinancialPlan } from './plan.mappers';
import { FinancialPlan, FinancialPlanDocument } from './schemas/financial-plan.schema';

@Injectable()
export class PlansService {
  constructor(
    @InjectModel(FinancialPlan.name) private readonly planModel: Model<FinancialPlan>
  ) {}

  async listForUser(userId: string, status?: 'active' | 'archived') {
    const q: Record<string, unknown> = { userId: new Types.ObjectId(userId) };
    if (status) {
      q.status = status;
    }
    const rows = await this.planModel.find(q).sort({ createdAt: -1 }).exec();
    return rows.map((d) => mapFinancialPlan(d as FinancialPlanDocument));
  }

  async listActiveForAssistant(userId: string) {
    const rows = await this.planModel
      .find({ userId: new Types.ObjectId(userId), status: 'active' })
      .sort({ createdAt: -1 })
      .limit(24)
      .exec();
    return rows.map((d) => mapFinancialPlan(d as FinancialPlanDocument));
  }

  async create(userId: string, dto: CreateFinancialPlanDto) {
    this.validateCreate(dto);
    const doc = await this.planModel.create({
      userId: new Types.ObjectId(userId),
      title: dto.title.trim(),
      planType: dto.planType,
      capMinor: dto.capMinor,
      category: dto.category?.trim() || undefined,
      targetMinor: dto.targetMinor,
      savedMinor: dto.savedMinor ?? 0,
      notes: dto.notes?.trim() || undefined,
      status: 'active'
    });
    return mapFinancialPlan(doc as FinancialPlanDocument);
  }

  async update(userId: string, id: string, dto: UpdateFinancialPlanDto) {
    const doc = await this.planModel
      .findOne({ _id: new Types.ObjectId(id), userId: new Types.ObjectId(userId) })
      .exec();
    if (!doc) {
      throw new NotFoundException('Plan not found');
    }
    if (dto.title !== undefined) {
      doc.title = dto.title.trim();
    }
    if (dto.capMinor !== undefined) {
      doc.capMinor = dto.capMinor;
    }
    if (dto.category !== undefined) {
      doc.category = dto.category.trim() || undefined;
    }
    if (dto.targetMinor !== undefined) {
      doc.targetMinor = dto.targetMinor;
    }
    if (dto.savedMinor !== undefined) {
      doc.savedMinor = dto.savedMinor;
    }
    if (dto.notes !== undefined) {
      doc.notes = dto.notes.trim() || undefined;
    }
    if (dto.status !== undefined) {
      doc.status = dto.status;
    }
    await doc.save();
    return mapFinancialPlan(doc as FinancialPlanDocument);
  }

  async remove(userId: string, id: string) {
    const res = await this.planModel
      .deleteOne({ _id: new Types.ObjectId(id), userId: new Types.ObjectId(userId) })
      .exec();
    if (res.deletedCount === 0) {
      throw new NotFoundException('Plan not found');
    }
    return { success: true as const };
  }

  private validateCreate(dto: CreateFinancialPlanDto): void {
    if (dto.planType === 'monthly_spend_cap') {
      if (dto.capMinor === undefined || dto.capMinor < 1) {
        throw new BadRequestException('monthly_spend_cap requires capMinor');
      }
      return;
    }
    if (dto.planType === 'category_spend_cap') {
      if (!dto.category?.trim()) {
        throw new BadRequestException('category_spend_cap requires category');
      }
      if (dto.capMinor === undefined || dto.capMinor < 1) {
        throw new BadRequestException('category_spend_cap requires capMinor');
      }
      return;
    }
    if (dto.planType === 'savings_target') {
      if (dto.targetMinor === undefined || dto.targetMinor < 1) {
        throw new BadRequestException('savings_target requires targetMinor');
      }
    }
  }
}
