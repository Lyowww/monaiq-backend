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
exports.FinancialPlanSchema = exports.FinancialPlan = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const user_schema_1 = require("../../users/schemas/user.schema");
let FinancialPlan = class FinancialPlan {
    userId;
    title;
    planType;
    capMinor;
    category;
    targetMinor;
    savedMinor;
    notes;
    status;
};
exports.FinancialPlan = FinancialPlan;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: user_schema_1.User.name, required: true, index: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], FinancialPlan.prototype, "userId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, trim: true, maxlength: 120 }),
    __metadata("design:type", String)
], FinancialPlan.prototype, "title", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        required: true,
        enum: ['monthly_spend_cap', 'category_spend_cap', 'savings_target']
    }),
    __metadata("design:type", String)
], FinancialPlan.prototype, "planType", void 0);
__decorate([
    (0, mongoose_1.Prop)({ min: 1 }),
    __metadata("design:type", Number)
], FinancialPlan.prototype, "capMinor", void 0);
__decorate([
    (0, mongoose_1.Prop)({ trim: true, maxlength: 64 }),
    __metadata("design:type", String)
], FinancialPlan.prototype, "category", void 0);
__decorate([
    (0, mongoose_1.Prop)({ min: 1 }),
    __metadata("design:type", Number)
], FinancialPlan.prototype, "targetMinor", void 0);
__decorate([
    (0, mongoose_1.Prop)({ min: 0, default: 0 }),
    __metadata("design:type", Number)
], FinancialPlan.prototype, "savedMinor", void 0);
__decorate([
    (0, mongoose_1.Prop)({ trim: true, maxlength: 500 }),
    __metadata("design:type", String)
], FinancialPlan.prototype, "notes", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, default: 'active', enum: ['active', 'archived'] }),
    __metadata("design:type", String)
], FinancialPlan.prototype, "status", void 0);
exports.FinancialPlan = FinancialPlan = __decorate([
    (0, mongoose_1.Schema)({
        collection: 'financial_plans',
        timestamps: true
    })
], FinancialPlan);
exports.FinancialPlanSchema = mongoose_1.SchemaFactory.createForClass(FinancialPlan);
exports.FinancialPlanSchema.index({ userId: 1, status: 1, createdAt: -1 });
//# sourceMappingURL=financial-plan.schema.js.map