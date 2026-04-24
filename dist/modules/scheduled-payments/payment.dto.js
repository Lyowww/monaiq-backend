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
exports.MarkPaymentPaidDto = exports.UpdateScheduledPaymentDto = exports.CreateScheduledPaymentDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateScheduledPaymentDto {
    title;
    description;
    amountMinor;
    dueDate;
    recurring;
    recurrenceType;
    category;
    reminderEnabled;
}
exports.CreateScheduledPaymentDto = CreateScheduledPaymentDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Electricity' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(200),
    __metadata("design:type", String)
], CreateScheduledPaymentDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(2000),
    __metadata("design:type", String)
], CreateScheduledPaymentDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], CreateScheduledPaymentDto.prototype, "amountMinor", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateScheduledPaymentDto.prototype, "dueDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateScheduledPaymentDto.prototype, "recurring", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: ['none', 'weekly', 'monthly'] }),
    (0, class_validator_1.IsIn)(['none', 'weekly', 'monthly']),
    __metadata("design:type", String)
], CreateScheduledPaymentDto.prototype, "recurrenceType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: ['utilities', 'subscription', 'rent', 'other'] }),
    (0, class_validator_1.IsIn)(['utilities', 'subscription', 'rent', 'other']),
    __metadata("design:type", String)
], CreateScheduledPaymentDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateScheduledPaymentDto.prototype, "reminderEnabled", void 0);
class UpdateScheduledPaymentDto {
    title;
    description;
    amountMinor;
    dueDate;
    recurring;
    recurrenceType;
    category;
    status;
    reminderEnabled;
}
exports.UpdateScheduledPaymentDto = UpdateScheduledPaymentDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(200),
    __metadata("design:type", String)
], UpdateScheduledPaymentDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(2000),
    __metadata("design:type", String)
], UpdateScheduledPaymentDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], UpdateScheduledPaymentDto.prototype, "amountMinor", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], UpdateScheduledPaymentDto.prototype, "dueDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateScheduledPaymentDto.prototype, "recurring", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(['none', 'weekly', 'monthly']),
    __metadata("design:type", String)
], UpdateScheduledPaymentDto.prototype, "recurrenceType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(['utilities', 'subscription', 'rent', 'other']),
    __metadata("design:type", String)
], UpdateScheduledPaymentDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(['pending', 'paid']),
    __metadata("design:type", String)
], UpdateScheduledPaymentDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateScheduledPaymentDto.prototype, "reminderEnabled", void 0);
class MarkPaymentPaidDto {
    amountMinor;
}
exports.MarkPaymentPaidDto = MarkPaymentPaidDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'If omitted, full scheduled amount is posted as an expense'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], MarkPaymentPaidDto.prototype, "amountMinor", void 0);
//# sourceMappingURL=payment.dto.js.map