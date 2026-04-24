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
exports.ScheduledPaymentSchema = exports.ScheduledPayment = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const user_schema_1 = require("../../users/schemas/user.schema");
let ScheduledPayment = class ScheduledPayment {
    userId;
    title;
    description;
    amountMinor;
    dueDate;
    recurring;
    recurrenceType;
    category;
    status;
    reminderEnabled;
};
exports.ScheduledPayment = ScheduledPayment;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: user_schema_1.User.name, required: true, index: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], ScheduledPayment.prototype, "userId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, trim: true }),
    __metadata("design:type", String)
], ScheduledPayment.prototype, "title", void 0);
__decorate([
    (0, mongoose_1.Prop)({ trim: true }),
    __metadata("design:type", String)
], ScheduledPayment.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, min: 1 }),
    __metadata("design:type", Number)
], ScheduledPayment.prototype, "amountMinor", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Date)
], ScheduledPayment.prototype, "dueDate", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, default: false }),
    __metadata("design:type", Boolean)
], ScheduledPayment.prototype, "recurring", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, default: 'none', enum: ['none', 'weekly', 'monthly'] }),
    __metadata("design:type", String)
], ScheduledPayment.prototype, "recurrenceType", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        required: true,
        default: 'other',
        enum: ['utilities', 'subscription', 'rent', 'other']
    }),
    __metadata("design:type", String)
], ScheduledPayment.prototype, "category", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, default: 'pending', enum: ['pending', 'paid'] }),
    __metadata("design:type", String)
], ScheduledPayment.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, default: true }),
    __metadata("design:type", Boolean)
], ScheduledPayment.prototype, "reminderEnabled", void 0);
exports.ScheduledPayment = ScheduledPayment = __decorate([
    (0, mongoose_1.Schema)({
        collection: 'scheduled_payments',
        timestamps: true
    })
], ScheduledPayment);
exports.ScheduledPaymentSchema = mongoose_1.SchemaFactory.createForClass(ScheduledPayment);
exports.ScheduledPaymentSchema.index({ userId: 1, dueDate: 1 });
exports.ScheduledPaymentSchema.index({ userId: 1, status: 1, dueDate: 1 });
//# sourceMappingURL=scheduled-payment.schema.js.map