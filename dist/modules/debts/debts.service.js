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
exports.DebtsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const debt_schema_1 = require("./schemas/debt.schema");
let DebtsService = class DebtsService {
    debtModel;
    constructor(debtModel) {
        this.debtModel = debtModel;
    }
    async listForUser(userId, debtType) {
        const filter = { userId: new mongoose_2.Types.ObjectId(userId) };
        if (debtType) {
            filter.debtType = debtType;
        }
        return this.debtModel.find(filter).sort({ dueDate: 1 }).exec();
    }
    async getById(userId, id) {
        const doc = await this.debtModel
            .findOne({ _id: new mongoose_2.Types.ObjectId(id), userId: new mongoose_2.Types.ObjectId(userId) })
            .exec();
        if (!doc) {
            throw new common_1.NotFoundException('Debt not found');
        }
        return doc;
    }
    async create(userId, dto) {
        const person = dto.personName.trim();
        const [created] = await this.debtModel.create([
            {
                userId: new mongoose_2.Types.ObjectId(userId),
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
    async update(userId, id, dto) {
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
    async remove(userId, id) {
        const res = await this.debtModel
            .deleteOne({ _id: new mongoose_2.Types.ObjectId(id), userId: new mongoose_2.Types.ObjectId(userId) })
            .exec();
        if (res.deletedCount === 0) {
            throw new common_1.NotFoundException('Debt not found');
        }
    }
};
exports.DebtsService = DebtsService;
exports.DebtsService = DebtsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(debt_schema_1.Debt.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], DebtsService);
//# sourceMappingURL=debts.service.js.map