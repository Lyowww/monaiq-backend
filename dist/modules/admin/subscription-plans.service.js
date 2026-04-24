"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionPlansService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const subscription_features_catalog_1 = require("./subscription-features.catalog");
const subscription_plan_schema_1 = require("./schemas/subscription-plan.schema");
let SubscriptionPlansService = class SubscriptionPlansService {
    planModel;
    constructor(planModel) {
        this.planModel = planModel;
    }
    listFeatureCatalog() {
        return subscription_features_catalog_1.SUBSCRIPTION_FEATURES.map((f) => ({ ...f }));
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
    async assertActivePlanKey(key) {
        const k = key.trim().toLowerCase();
        const found = await this.planModel.findOne({ key: k, isActive: true }).lean().exec();
        if (!found) {
            throw new common_1.BadRequestException('Unknown or inactive subscription plan');
        }
    }
    /**
     * Resolves feature ids for API responses and mobile gating.
     * Paid plan features are unioned with {@link BASE_FREE_SUBSCRIPTION_FEATURE_IDS}.
     * Legacy `subscription: premium` without a plan key = full catalog.
     */
    async getEntitledFeatureIdsForUser(user) {
        const base = new Set(subscription_features_catalog_1.BASE_FREE_SUBSCRIPTION_FEATURE_IDS);
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
            return subscription_features_catalog_1.SUBSCRIPTION_FEATURES.map((f) => f.id);
        }
        return [...base];
    }
    async createPlan(body) {
        try {
            (0, subscription_features_catalog_1.assertFeatureIds)(body.featureIds);
        }
        catch (e) {
            throw new common_1.BadRequestException(e instanceof Error ? e.message : 'Invalid features');
        }
        const key = body.key.trim().toLowerCase().replace(/\s+/g, '-');
        if (!key) {
            throw new common_1.BadRequestException('key is required');
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
    async patchPlan(id, patch) {
        if (patch.featureIds) {
            try {
                (0, subscription_features_catalog_1.assertFeatureIds)(patch.featureIds);
            }
            catch (e) {
                throw new common_1.BadRequestException(e instanceof Error ? e.message : 'Invalid features');
            }
        }
        const set = {};
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
            .findByIdAndUpdate(new mongoose_2.Types.ObjectId(id), { $set: set }, { new: true })
            .lean()
            .exec();
        if (!doc) {
            throw new common_1.NotFoundException('Plan not found');
        }
        return this.toDto(doc);
    }
    async deletePlan(id) {
        const res = await this.planModel.findByIdAndDelete(new mongoose_2.Types.ObjectId(id)).exec();
        if (!res) {
            throw new common_1.NotFoundException('Plan not found');
        }
        return { success: true };
    }
    toDto(p) {
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
};
exports.SubscriptionPlansService = SubscriptionPlansService;
exports.SubscriptionPlansService = SubscriptionPlansService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(subscription_plan_schema_1.SubscriptionPlan.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], SubscriptionPlansService);
//# sourceMappingURL=subscription-plans.service.js.map