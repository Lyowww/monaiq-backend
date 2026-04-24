import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import type { UserDocument } from '../users/schemas/user.schema';
import {
  BASE_FREE_SUBSCRIPTION_FEATURE_IDS,
  SUBSCRIPTION_FEATURES,
  assertFeatureIds
} from './subscription-features.catalog';
import {
  SubscriptionPlan,
  type SubscriptionPlanDocument
} from './schemas/subscription-plan.schema';

@Injectable()
export class SubscriptionPlansService {
  constructor(
    @InjectModel(SubscriptionPlan.name)
    private readonly planModel: Model<SubscriptionPlanDocument>
  ) {}

  listFeatureCatalog() {
    return SUBSCRIPTION_FEATURES.map((f) => ({ ...f }));
  }

  async listPlans() {
    const rows = await this.planModel.find().sort({ sortOrder: 1, name: 1 }).lean().exec();
    return rows.map((p) => this.toDto(p));
  }

  /** Active plans for store / mobile (no auth). */
  async listPublicPlans() {
    const rows = await this.planModel
      .find({ isActive: true })
      .sort({ sortOrder: 1, name: 1 })
      .lean()
      .exec();
    return rows.map((p) => this.toDto(p));
  }

  async assertActivePlanKey(key: string): Promise<void> {
    const k = key.trim().toLowerCase();
    const found = await this.planModel.findOne({ key: k, isActive: true }).lean().exec();
    if (!found) {
      throw new BadRequestException('Unknown or inactive subscription plan');
    }
  }

  /**
   * Resolves feature ids for API responses and mobile gating.
   * Paid plan features are unioned with {@link BASE_FREE_SUBSCRIPTION_FEATURE_IDS}.
   * Legacy `subscription: premium` without a plan key = full catalog.
   */
  async getEntitledFeatureIdsForUser(user: UserDocument): Promise<string[]> {
    const base = new Set<string>(BASE_FREE_SUBSCRIPTION_FEATURE_IDS);
    const legacyPremium = user.settings?.subscription === 'premium';
    const rawKey = user.settings?.subscriptionPlanKey;
    const key = typeof rawKey === 'string' ? rawKey.trim().toLowerCase() : '';

    if (key) {
      const plan = await this.planModel.findOne({ key, isActive: true }).lean().exec();
      if (plan?.featureIds?.length) {
        for (const id of plan.featureIds) {
          base.add(id);
        }
        return [...base];
      }
    }

    if (legacyPremium && !key) {
      return SUBSCRIPTION_FEATURES.map((f) => f.id);
    }

    return [...base];
  }

  async createPlan(body: {
    key: string;
    name: string;
    description?: string;
    priceMinor: number;
    currencyCode: 'AMD' | 'USD' | 'EUR';
    billingPeriod: 'month' | 'year';
    featureIds: string[];
    sortOrder?: number;
    isActive?: boolean;
    highlightTag?: string;
  }) {
    try {
      assertFeatureIds(body.featureIds);
    } catch (e) {
      throw new BadRequestException(e instanceof Error ? e.message : 'Invalid features');
    }
    const key = body.key.trim().toLowerCase().replace(/\s+/g, '-');
    if (!key) {
      throw new BadRequestException('key is required');
    }
    const created = await this.planModel.create({
      key,
      name: body.name.trim(),
      description: body.description?.trim(),
      priceMinor: Math.max(0, Math.floor(body.priceMinor)),
      currencyCode: body.currencyCode,
      billingPeriod: body.billingPeriod,
      featureIds: [...new Set(body.featureIds)],
      sortOrder: body.sortOrder ?? 0,
      isActive: body.isActive !== false,
      highlightTag: body.highlightTag?.trim()
    });
    return this.toDto(created.toObject());
  }

  async patchPlan(
    id: string,
    patch: Partial<{
      name: string;
      description: string | null;
      priceMinor: number;
      currencyCode: 'AMD' | 'USD' | 'EUR';
      billingPeriod: 'month' | 'year';
      featureIds: string[];
      sortOrder: number;
      isActive: boolean;
      highlightTag: string | null;
    }>
  ) {
    if (patch.featureIds) {
      try {
        assertFeatureIds(patch.featureIds);
      } catch (e) {
        throw new BadRequestException(e instanceof Error ? e.message : 'Invalid features');
      }
    }
    const set: Record<string, unknown> = {};
    if (patch.name !== undefined) {
      set.name = patch.name.trim();
    }
    if (patch.description !== undefined) {
      set.description = patch.description === null ? undefined : patch.description.trim();
    }
    if (patch.priceMinor !== undefined) {
      set.priceMinor = Math.max(0, Math.floor(patch.priceMinor));
    }
    if (patch.currencyCode !== undefined) {
      set.currencyCode = patch.currencyCode;
    }
    if (patch.billingPeriod !== undefined) {
      set.billingPeriod = patch.billingPeriod;
    }
    if (patch.featureIds !== undefined) {
      set.featureIds = [...new Set(patch.featureIds)];
    }
    if (patch.sortOrder !== undefined) {
      set.sortOrder = patch.sortOrder;
    }
    if (patch.isActive !== undefined) {
      set.isActive = patch.isActive;
    }
    if (patch.highlightTag !== undefined) {
      set.highlightTag =
        patch.highlightTag === null || patch.highlightTag === ''
          ? undefined
          : patch.highlightTag.trim();
    }
    const doc = await this.planModel
      .findByIdAndUpdate(new Types.ObjectId(id), { $set: set }, { new: true })
      .lean()
      .exec();
    if (!doc) {
      throw new NotFoundException('Plan not found');
    }
    return this.toDto(doc);
  }

  async deletePlan(id: string) {
    const res = await this.planModel.findByIdAndDelete(new Types.ObjectId(id)).exec();
    if (!res) {
      throw new NotFoundException('Plan not found');
    }
    return { success: true as const };
  }

  private toDto(p: {
    _id: Types.ObjectId;
    key: string;
    name: string;
    description?: string;
    priceMinor: number;
    currencyCode: string;
    billingPeriod: string;
    featureIds: string[];
    sortOrder: number;
    isActive: boolean;
    highlightTag?: string;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    return {
      id: p._id.toString(),
      key: p.key,
      name: p.name,
      description: p.description ?? null,
      priceMinor: p.priceMinor,
      currencyCode: p.currencyCode,
      billingPeriod: p.billingPeriod,
      featureIds: p.featureIds ?? [],
      sortOrder: p.sortOrder ?? 0,
      isActive: p.isActive !== false,
      highlightTag: p.highlightTag ?? null,
      createdAt: p.createdAt ? new Date(p.createdAt).toISOString() : null,
      updatedAt: p.updatedAt ? new Date(p.updatedAt).toISOString() : null
    };
  }
}
