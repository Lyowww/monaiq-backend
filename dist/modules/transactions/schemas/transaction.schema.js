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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionSchema = exports.Transaction = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const debt_schema_1 = require("../../debts/schemas/debt.schema");
const user_schema_1 = require("../../users/schemas/user.schema");
let Transaction = class Transaction {
    userId;
    debtId;
    obligationId;
    scheduledPaymentId;
    source;
    category;
    subcategory;
    direction;
    amountMinor;
    currencyCode;
    bookedAt;
    merchantName;
    notes;
    isTransfer;
    quickCommandRaw;
    incomeSource;
    recurring;
    recurrenceType;
    /** When absent, analytics treat the row as card (matches legacy data). */
    pocket;
};
exports.Transaction = Transaction;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: user_schema_1.User.name, required: true, index: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Transaction.prototype, "userId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: debt_schema_1.Debt.name }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Transaction.prototype, "debtId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Obligation' }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Transaction.prototype, "obligationId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'ScheduledPayment' }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Transaction.prototype, "scheduledPaymentId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: ['manual', 'ocr', 'voice', 'bank_sync', 'suggestion'] }),
    __metadata("design:type", String)
], Transaction.prototype, "source", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, trim: true }),
    __metadata("design:type", String)
], Transaction.prototype, "category", void 0);
__decorate([
    (0, mongoose_1.Prop)({ trim: true }),
    __metadata("design:type", String)
], Transaction.prototype, "subcategory", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: ['credit', 'debit'] }),
    __metadata("design:type", String)
], Transaction.prototype, "direction", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, min: 1 }),
    __metadata("design:type", Number)
], Transaction.prototype, "amountMinor", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, default: 'AMD' }),
    __metadata("design:type", String)
], Transaction.prototype, "currencyCode", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Date)
], Transaction.prototype, "bookedAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ trim: true }),
    __metadata("design:type", String)
], Transaction.prototype, "merchantName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ trim: true }),
    __metadata("design:type", String)
], Transaction.prototype, "notes", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, default: false }),
    __metadata("design:type", Boolean)
], Transaction.prototype, "isTransfer", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Transaction.prototype, "quickCommandRaw", void 0);
__decorate([
    (0, mongoose_1.Prop)({ enum: ['salary', 'freelance', 'gift', 'other'] }),
    __metadata("design:type", String)
], Transaction.prototype, "incomeSource", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Boolean)
], Transaction.prototype, "recurring", void 0);
__decorate([
    (0, mongoose_1.Prop)({ enum: ['none', 'monthly', 'weekly'] }),
    __metadata("design:type", String)
], Transaction.prototype, "recurrenceType", void 0);
__decorate([
    (0, mongoose_1.Prop)({ enum: ['cash', 'card'] }),
    __metadata("design:type", String)
], Transaction.prototype, "pocket", void 0);
exports.Transaction = Transaction = __decorate([
    (0, mongoose_1.Schema)({
        collection: 'transactions',
        timestamps: true
    })
], Transaction);
exports.TransactionSchema = mongoose_1.SchemaFactory.createForClass(Transaction);
exports.TransactionSchema.index({ userId: 1, bookedAt: -1 });
//# sourceMappingURL=transaction.schema.js.map