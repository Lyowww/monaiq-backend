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
exports.ScheduledPaymentsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const transaction_schema_1 = require("../transactions/schemas/transaction.schema");
const scheduled_payment_schema_1 = require("./schemas/scheduled-payment.schema");
function addRecurrence(d, type) {
    const next = new Date(d.getTime());
    if (type === 'weekly') {
        next.setUTCDate(next.getUTCDate() + 7);
        return next;
    }
    const m = next.getUTCMonth() + 1;
    next.setUTCMonth(m);
    return next;
}
let ScheduledPaymentsService = class ScheduledPaymentsService {
    paymentModel;
    transactionModel;
    connection;
    constructor(paymentModel, transactionModel, connection) {
        this.paymentModel = paymentModel;
        this.transactionModel = transactionModel;
        this.connection = connection;
    }
    listForUser(userId) {
        return this.paymentModel
            .find({ userId: new mongoose_2.Types.ObjectId(userId) })
            .sort({ dueDate: 1 })
            .exec();
    }
    async getById(userId, id) {
        const p = await this.paymentModel
            .findOne({ _id: new mongoose_2.Types.ObjectId(id), userId: new mongoose_2.Types.ObjectId(userId) })
            .exec();
        if (!p) {
            throw new common_1.NotFoundException('Payment not found');
        }
        return p;
    }
    async create(userId, dto) {
        const [created] = await this.paymentModel.create([
            {
                userId: new mongoose_2.Types.ObjectId(userId),
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
    async update(userId, id, dto) {
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
    async remove(userId, id) {
        const res = await this.paymentModel
            .deleteOne({ _id: new mongoose_2.Types.ObjectId(id), userId: new mongoose_2.Types.ObjectId(userId) })
            .exec();
        if (res.deletedCount === 0) {
            throw new common_1.NotFoundException('Payment not found');
        }
    }
    async markPaid(userId, id, dto) {
        const session = await this.connection.startSession();
        try {
            session.startTransaction();
            const p = await this.paymentModel
                .findOne({ _id: new mongoose_2.Types.ObjectId(id), userId: new mongoose_2.Types.ObjectId(userId) })
                .session(session)
                .exec();
            if (!p) {
                throw new common_1.NotFoundException('Payment not found');
            }
            if (p.status === 'paid' && !p.recurring) {
                throw new common_1.BadRequestException('Payment already settled');
            }
            const payAmount = Math.min(dto.amountMinor ?? p.amountMinor, p.amountMinor);
            if (payAmount < 1) {
                throw new common_1.BadRequestException('Invalid amount');
            }
            await this.transactionModel.create([
                {
                    userId: p.userId,
                    scheduledPaymentId: p._id,
                    source: 'manual',
                    category: p.category,
                    subcategory: 'scheduled_bill',
                    direction: 'debit',
                    amountMinor: payAmount,
                    currencyCode: 'AMD',
                    bookedAt: new Date(),
                    merchantName: p.title,
                    notes: p.description,
                    isTransfer: false
                }
            ], { session });
            if (p.recurring && p.recurrenceType !== 'none') {
                p.dueDate = addRecurrence(p.dueDate, p.recurrenceType === 'weekly' ? 'weekly' : 'monthly');
                p.status = 'pending';
            }
            else {
                p.status = 'paid';
            }
            await p.save({ session });
            await session.commitTransaction();
            return p;
        }
        catch (e) {
            await session.abortTransaction();
            throw e;
        }
        finally {
            await session.endSession();
        }
    }
};
exports.ScheduledPaymentsService = ScheduledPaymentsService;
exports.ScheduledPaymentsService = ScheduledPaymentsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(scheduled_payment_schema_1.ScheduledPayment.name)),
    __param(1, (0, mongoose_1.InjectModel)(transaction_schema_1.Transaction.name)),
    __param(2, (0, mongoose_1.InjectConnection)()),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Connection])
], ScheduledPaymentsService);
//# sourceMappingURL=scheduled-payments.service.js.map