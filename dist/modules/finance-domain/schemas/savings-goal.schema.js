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
exports.SavingsGoalSchema = exports.SavingsGoal = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const user_schema_1 = require("../../users/schemas/user.schema");
let SavingsGoal = class SavingsGoal {
    userId;
    title;
    targetMinor;
    currencyCode;
    targetAt;
    savedMinor;
    /** AI “safe to save” nudge, minor units, optional */
    safeToSaveMinor;
    lastCoachAdviceAt;
    status;
};
exports.SavingsGoal = SavingsGoal;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: user_schema_1.User.name, required: true, index: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], SavingsGoal.prototype, "userId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, trim: true, maxlength: 200 }),
    __metadata("design:type", String)
], SavingsGoal.prototype, "title", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, min: 1 }),
    __metadata("design:type", Number)
], SavingsGoal.prototype, "targetMinor", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, default: 'AMD' }),
    __metadata("design:type", String)
], SavingsGoal.prototype, "currencyCode", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], SavingsGoal.prototype, "targetAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ min: 0, default: 0 }),
    __metadata("design:type", Number)
], SavingsGoal.prototype, "savedMinor", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], SavingsGoal.prototype, "safeToSaveMinor", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], SavingsGoal.prototype, "lastCoachAdviceAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, default: 'active', enum: ['active', 'completed', 'archived'] }),
    __metadata("design:type", String)
], SavingsGoal.prototype, "status", void 0);
exports.SavingsGoal = SavingsGoal = __decorate([
    (0, mongoose_1.Schema)({
        collection: 'savings_goals',
        timestamps: true
    })
], SavingsGoal);
exports.SavingsGoalSchema = mongoose_1.SchemaFactory.createForClass(SavingsGoal);
exports.SavingsGoalSchema.index({ userId: 1, status: 1, createdAt: -1 });
//# sourceMappingURL=savings-goal.schema.js.map