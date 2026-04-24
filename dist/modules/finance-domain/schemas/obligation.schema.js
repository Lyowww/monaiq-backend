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
exports.ObligationSchema = exports.Obligation = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const user_schema_1 = require("../../users/schemas/user.schema");
let Obligation = class Obligation {
    userId;
    kind;
    /** Shown in UI; can be entered in English or Eastern Armenian. */
    title;
    amountDueMinor;
    currencyCode;
    nextDueAt;
    cadence;
    utilityType;
    serviceProviderName;
    accountReference;
    pushReminderEnabled;
    fcmTokenSnapshot;
    status;
    labelLocale;
};
exports.Obligation = Obligation;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: user_schema_1.User.name, required: true, index: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Obligation.prototype, "userId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: ['loan', 'utility', 'subscription'], index: true }),
    __metadata("design:type", String)
], Obligation.prototype, "kind", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, trim: true, maxlength: 200 }),
    __metadata("design:type", String)
], Obligation.prototype, "title", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, min: 0 }),
    __metadata("design:type", Number)
], Obligation.prototype, "amountDueMinor", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, default: 'AMD' }),
    __metadata("design:type", String)
], Obligation.prototype, "currencyCode", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Date)
], Obligation.prototype, "nextDueAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: ['one_time', 'monthly', 'quarterly', 'yearly'] }),
    __metadata("design:type", String)
], Obligation.prototype, "cadence", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Obligation.prototype, "utilityType", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Obligation.prototype, "serviceProviderName", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Obligation.prototype, "accountReference", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, default: false, index: true }),
    __metadata("design:type", Boolean)
], Obligation.prototype, "pushReminderEnabled", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Obligation.prototype, "fcmTokenSnapshot", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, default: 'active', enum: ['active', 'snoozed', 'closed'] }),
    __metadata("design:type", String)
], Obligation.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, enum: ['en', 'hy'], default: 'hy' }),
    __metadata("design:type", String)
], Obligation.prototype, "labelLocale", void 0);
exports.Obligation = Obligation = __decorate([
    (0, mongoose_1.Schema)({
        collection: 'obligations',
        timestamps: true
    })
], Obligation);
exports.ObligationSchema = mongoose_1.SchemaFactory.createForClass(Obligation);
exports.ObligationSchema.index({ userId: 1, nextDueAt: 1, kind: 1 });
//# sourceMappingURL=obligation.schema.js.map