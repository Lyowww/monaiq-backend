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
exports.CreateTransactionDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class CreateTransactionDto {
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
    debtId;
    quickCommandRaw;
    incomeSource;
    recurring;
    recurrenceType;
    pocket;
}
exports.CreateTransactionDto = CreateTransactionDto;
__decorate([
    (0, swagger_1.ApiProperty)({ enum: ['manual', 'ocr', 'voice', 'bank_sync', 'suggestion'], example: 'manual' }),
    (0, class_validator_1.IsIn)(['manual', 'ocr', 'voice', 'bank_sync', 'suggestion']),
    __metadata("design:type", String)
], CreateTransactionDto.prototype, "source", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'food' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(64),
    __metadata("design:type", String)
], CreateTransactionDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'fast_food' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(64),
    __metadata("design:type", String)
], CreateTransactionDto.prototype, "subcategory", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: ['credit', 'debit'], example: 'debit' }),
    (0, class_validator_1.IsIn)(['credit', 'debit']),
    __metadata("design:type", String)
], CreateTransactionDto.prototype, "direction", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 350000 }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], CreateTransactionDto.prototype, "amountMinor", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: ['AMD'], example: 'AMD' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateTransactionDto.prototype, "currencyCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2026-04-22T18:10:00.000Z' }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateTransactionDto.prototype, "bookedAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'KFC' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(120),
    __metadata("design:type", String)
], CreateTransactionDto.prototype, "merchantName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Quick command expense' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(280),
    __metadata("design:type", String)
], CreateTransactionDto.prototype, "notes", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateTransactionDto.prototype, "isTransfer", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '6807fa8f0d0c6f8ef1f8f999' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsMongoId)(),
    __metadata("design:type", String)
], CreateTransactionDto.prototype, "debtId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'kfc 3500' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(120),
    __metadata("design:type", String)
], CreateTransactionDto.prototype, "quickCommandRaw", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: ['salary', 'freelance', 'gift', 'other'] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(['salary', 'freelance', 'gift', 'other']),
    __metadata("design:type", String)
], CreateTransactionDto.prototype, "incomeSource", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateTransactionDto.prototype, "recurring", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: ['none', 'monthly', 'weekly'] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(['none', 'monthly', 'weekly']),
    __metadata("design:type", String)
], CreateTransactionDto.prototype, "recurrenceType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: ['cash', 'card'], example: 'card' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(['cash', 'card']),
    __metadata("design:type", String)
], CreateTransactionDto.prototype, "pocket", void 0);
//# sourceMappingURL=create-transaction.dto.js.map