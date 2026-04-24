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
exports.SubscriptionPlanSchema = exports.SubscriptionPlan = void 0;
const mongoose_1 = require("@nestjs/mongoose");
let SubscriptionPlan = class SubscriptionPlan {
    key;
    name;
    description;
    /** Price in minor units (e.g. dram cents or whole AMD depending on product convention). */
    priceMinor;
    currencyCode;
    billingPeriod;
    featureIds;
    sortOrder;
    isActive;
    /** Short label shown on cards, e.g. "Popular". */
    highlightTag;
};
exports.SubscriptionPlan = SubscriptionPlan;
__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: true, trim: true, lowercase: true }),
    __metadata("design:type", String)
], SubscriptionPlan.prototype, "key", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, trim: true }),
    __metadata("design:type", String)
], SubscriptionPlan.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)({ trim: true }),
    __metadata("design:type", String)
], SubscriptionPlan.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, min: 0 }),
    __metadata("design:type", Number)
], SubscriptionPlan.prototype, "priceMinor", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: ['AMD', 'USD', 'EUR'], default: 'AMD' }),
    __metadata("design:type", String)
], SubscriptionPlan.prototype, "currencyCode", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: ['month', 'year'], default: 'month' }),
    __metadata("design:type", String)
], SubscriptionPlan.prototype, "billingPeriod", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], default: [] }),
    __metadata("design:type", Array)
], SubscriptionPlan.prototype, "featureIds", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], SubscriptionPlan.prototype, "sortOrder", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], SubscriptionPlan.prototype, "isActive", void 0);
__decorate([
    (0, mongoose_1.Prop)({ trim: true }),
    __metadata("design:type", String)
], SubscriptionPlan.prototype, "highlightTag", void 0);
exports.SubscriptionPlan = SubscriptionPlan = __decorate([
    (0, mongoose_1.Schema)({
        collection: 'subscription_plans',
        timestamps: true
    })
], SubscriptionPlan);
exports.SubscriptionPlanSchema = mongoose_1.SchemaFactory.createForClass(SubscriptionPlan);
exports.SubscriptionPlanSchema.index({ sortOrder: 1, key: 1 });
//# sourceMappingURL=subscription-plan.schema.js.map