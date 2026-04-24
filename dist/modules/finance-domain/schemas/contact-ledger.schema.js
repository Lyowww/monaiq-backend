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
exports.ContactLedgerSchema = exports.ContactLedger = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const user_schema_1 = require("../../users/schemas/user.schema");
let ContactLedger = class ContactLedger {
    userId;
    contactDisplayName;
    contactPhoneE164;
    lastInteractionAt;
    contactFrequencyScore;
    amountMinor;
    currencyCode;
    direction;
    status;
    lastReminderAt;
    reminderCount;
    lastReminderMessageHy;
    lastReminderMessageEn;
};
exports.ContactLedger = ContactLedger;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: user_schema_1.User.name, required: true, index: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], ContactLedger.prototype, "userId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, trim: true, maxlength: 200 }),
    __metadata("design:type", String)
], ContactLedger.prototype, "contactDisplayName", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], ContactLedger.prototype, "contactPhoneE164", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], ContactLedger.prototype, "lastInteractionAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, default: 0, min: 0 }),
    __metadata("design:type", Number)
], ContactLedger.prototype, "contactFrequencyScore", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, min: 1 }),
    __metadata("design:type", Number)
], ContactLedger.prototype, "amountMinor", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, default: 'AMD' }),
    __metadata("design:type", String)
], ContactLedger.prototype, "currencyCode", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: ['borrowed', 'lent'] }),
    __metadata("design:type", String)
], ContactLedger.prototype, "direction", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, default: 'open', enum: ['open', 'settled', 'disputed'] }),
    __metadata("design:type", String)
], ContactLedger.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], ContactLedger.prototype, "lastReminderAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0, min: 0 }),
    __metadata("design:type", Number)
], ContactLedger.prototype, "reminderCount", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], ContactLedger.prototype, "lastReminderMessageHy", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], ContactLedger.prototype, "lastReminderMessageEn", void 0);
exports.ContactLedger = ContactLedger = __decorate([
    (0, mongoose_1.Schema)({
        collection: 'contact_ledgers',
        timestamps: true
    })
], ContactLedger);
exports.ContactLedgerSchema = mongoose_1.SchemaFactory.createForClass(ContactLedger);
exports.ContactLedgerSchema.index({ userId: 1, contactDisplayName: 1 });
exports.ContactLedgerSchema.index({ userId: 1, status: 1, lastInteractionAt: -1 });
//# sourceMappingURL=contact-ledger.schema.js.map