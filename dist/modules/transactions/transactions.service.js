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
exports.TransactionsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const debt_schema_1 = require("../debts/schemas/debt.schema");
const transaction_schema_1 = require("./schemas/transaction.schema");
let TransactionsService = class TransactionsService {
    transactionModel;
    debtModel;
    connection;
    constructor(transactionModel, debtModel, connection) {
        this.transactionModel = transactionModel;
        this.debtModel = debtModel;
        this.connection = connection;
    }
    async createTransaction(userId, dto) {
        const session = await this.connection.startSession();
        try {
            session.startTransaction();
            const debt = dto.debtId && dto.direction === 'debit'
                ? await this.debtModel
                    .findOne({
                    _id: new mongoose_2.Types.ObjectId(dto.debtId),
                    userId: new mongoose_2.Types.ObjectId(userId)
                })
                    .session(session)
                    .exec()
                : null;
            if (dto.debtId && !debt) {
                throw new common_1.NotFoundException('Linked debt could not be found');
            }
            const createdTransactions = await this.transactionModel.create([
                {
                    userId: new mongoose_2.Types.ObjectId(userId),
                    debtId: dto.debtId ? new mongoose_2.Types.ObjectId(dto.debtId) : undefined,
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
            ], { session });
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
        }
        catch (error) {
            await session.abortTransaction();
            throw error;
        }
        finally {
            await session.endSession();
        }
    }
    listRecent(userId, limit = 8) {
        return this.transactionModel
            .find({ userId: new mongoose_2.Types.ObjectId(userId) })
            .sort({ bookedAt: -1 })
            .limit(limit)
            .exec();
    }
    listFiltered(userId, options) {
        const match = { userId: new mongoose_2.Types.ObjectId(userId) };
        if (options.type === 'expense') {
            match.direction = 'debit';
        }
        else if (options.type === 'income') {
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
    async updateTransaction(userId, id, dto) {
        const t = await this.transactionModel
            .findOne({ _id: new mongoose_2.Types.ObjectId(id), userId: new mongoose_2.Types.ObjectId(userId) })
            .exec();
        if (!t) {
            throw new common_1.NotFoundException('Transaction not found');
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
    async deleteTransaction(userId, id) {
        const res = await this.transactionModel
            .deleteOne({ _id: new mongoose_2.Types.ObjectId(id), userId: new mongoose_2.Types.ObjectId(userId) })
            .exec();
        if (res.deletedCount === 0) {
            throw new common_1.NotFoundException('Transaction not found');
        }
    }
};
exports.TransactionsService = TransactionsService;
exports.TransactionsService = TransactionsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(transaction_schema_1.Transaction.name)),
    __param(1, (0, mongoose_1.InjectModel)(debt_schema_1.Debt.name)),
    __param(2, (0, mongoose_1.InjectConnection)()),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Connection])
], TransactionsService);
function escapeRegex(s) {
    return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
//# sourceMappingURL=transactions.service.js.map