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
exports.DebtSchema = exports.Debt = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const user_schema_1 = require("../../users/schemas/user.schema");
let Debt = class Debt {
    userId;
    lenderName;
    personName;
    debtType;
    reason;
    reminderEnabled;
    principalMinor;
    outstandingMinor;
    minimumDueMinor;
    aprPercent;
    dueDate;
    relationship;
    status;
};
exports.Debt = Debt;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: user_schema_1.User.name, required: true, index: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Debt.prototype, "userId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, trim: true }),
    __metadata("design:type", String)
], Debt.prototype, "lenderName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ trim: true }),
    __metadata("design:type", String)
], Debt.prototype, "personName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, default: 'I_OWE', enum: ['I_OWE', 'THEY_OWE'] }),
    __metadata("design:type", String)
], Debt.prototype, "debtType", void 0);
__decorate([
    (0, mongoose_1.Prop)({ trim: true }),
    __metadata("design:type", String)
], Debt.prototype, "reason", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, default: true }),
    __metadata("design:type", Boolean)
], Debt.prototype, "reminderEnabled", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, min: 1 }),
    __metadata("design:type", Number)
], Debt.prototype, "principalMinor", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, min: 0 }),
    __metadata("design:type", Number)
], Debt.prototype, "outstandingMinor", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, min: 0 }),
    __metadata("design:type", Number)
], Debt.prototype, "minimumDueMinor", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, min: 0 }),
    __metadata("design:type", Number)
], Debt.prototype, "aprPercent", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Date)
], Debt.prototype, "dueDate", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: ['family', 'friend', 'bank', 'fintech', 'other'] }),
    __metadata("design:type", String)
], Debt.prototype, "relationship", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, default: 'active', enum: ['active', 'settled', 'defaulted'] }),
    __metadata("design:type", String)
], Debt.prototype, "status", void 0);
exports.Debt = Debt = __decorate([
    (0, mongoose_1.Schema)({
        collection: 'debts',
        timestamps: true
    })
], Debt);
exports.DebtSchema = mongoose_1.SchemaFactory.createForClass(Debt);
exports.DebtSchema.index({ userId: 1, dueDate: 1 });
//# sourceMappingURL=debt.schema.js.map