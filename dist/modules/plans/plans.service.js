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
exports.PlansService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const plan_mappers_1 = require("./plan.mappers");
const financial_plan_schema_1 = require("./schemas/financial-plan.schema");
let PlansService = class PlansService {
    planModel;
    constructor(planModel) {
        this.planModel = planModel;
    }
    async listForUser(userId, status) {
        const q = { userId: new mongoose_2.Types.ObjectId(userId) };
        if (status) {
            q.status = status;
        }
        const rows = await this.planModel.find(q).sort({ createdAt: -1 }).exec();
        return rows.map((d) => (0, plan_mappers_1.mapFinancialPlan)(d));
    }
    async listActiveForAssistant(userId) {
        const rows = await this.planModel
            .find({ userId: new mongoose_2.Types.ObjectId(userId), status: 'active' })
            .sort({ createdAt: -1 })
            .limit(24)
            .exec();
        return rows.map((d) => (0, plan_mappers_1.mapFinancialPlan)(d));
    }
    async create(userId, dto) {
        this.validateCreate(dto);
        const doc = await this.planModel.create({
            userId: new mongoose_2.Types.ObjectId(userId),
            title: dto.title.trim(),
            planType: dto.planType,
            capMinor: dto.capMinor,
            category: dto.category?.trim() || undefined,
            targetMinor: dto.targetMinor,
            savedMinor: dto.savedMinor ?? 0,
            notes: dto.notes?.trim() || undefined,
            status: 'active'
        });
        return (0, plan_mappers_1.mapFinancialPlan)(doc);
    }
    async update(userId, id, dto) {
        const doc = await this.planModel
            .findOne({ _id: new mongoose_2.Types.ObjectId(id), userId: new mongoose_2.Types.ObjectId(userId) })
            .exec();
        if (!doc) {
            throw new common_1.NotFoundException('Plan not found');
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
        return (0, plan_mappers_1.mapFinancialPlan)(doc);
    }
    async remove(userId, id) {
        const res = await this.planModel
            .deleteOne({ _id: new mongoose_2.Types.ObjectId(id), userId: new mongoose_2.Types.ObjectId(userId) })
            .exec();
        if (res.deletedCount === 0) {
            throw new common_1.NotFoundException('Plan not found');
        }
        return { success: true };
    }
    validateCreate(dto) {
        if (dto.planType === 'monthly_spend_cap') {
            if (dto.capMinor === undefined || dto.capMinor < 1) {
                throw new common_1.BadRequestException('monthly_spend_cap requires capMinor');
            }
            return;
        }
        if (dto.planType === 'category_spend_cap') {
            if (!dto.category?.trim()) {
                throw new common_1.BadRequestException('category_spend_cap requires category');
            }
            if (dto.capMinor === undefined || dto.capMinor < 1) {
                throw new common_1.BadRequestException('category_spend_cap requires capMinor');
            }
            return;
        }
        if (dto.planType === 'savings_target') {
            if (dto.targetMinor === undefined || dto.targetMinor < 1) {
                throw new common_1.BadRequestException('savings_target requires targetMinor');
            }
        }
    }
};
exports.PlansService = PlansService;
exports.PlansService = PlansService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(financial_plan_schema_1.FinancialPlan.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], PlansService);
//# sourceMappingURL=plans.service.js.map