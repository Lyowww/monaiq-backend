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
exports.UpdateDebtDto = exports.CreateDebtDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateDebtDto {
    personName;
    debtType;
    reason;
    principalMinor;
    outstandingMinor;
    minimumDueMinor;
    aprPercent;
    dueDate;
    relationship;
    reminderEnabled;
}
exports.CreateDebtDto = CreateDebtDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Ashot' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(120),
    __metadata("design:type", String)
], CreateDebtDto.prototype, "personName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'I_OWE' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(['I_OWE', 'THEY_OWE']),
    __metadata("design:type", String)
], CreateDebtDto.prototype, "debtType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", String)
], CreateDebtDto.prototype, "reason", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 50_000_00 }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], CreateDebtDto.prototype, "principalMinor", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 50_000_00 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateDebtDto.prototype, "outstandingMinor", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 5_000_00 }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateDebtDto.prototype, "minimumDueMinor", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 0 }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateDebtDto.prototype, "aprPercent", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateDebtDto.prototype, "dueDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: ['family', 'friend', 'bank', 'fintech', 'other'] }),
    (0, class_validator_1.IsIn)(['family', 'friend', 'bank', 'fintech', 'other']),
    __metadata("design:type", String)
], CreateDebtDto.prototype, "relationship", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateDebtDto.prototype, "reminderEnabled", void 0);
class UpdateDebtDto {
    personName;
    lenderName;
    debtType;
    reason;
    principalMinor;
    outstandingMinor;
    minimumDueMinor;
    aprPercent;
    dueDate;
    relationship;
    status;
    reminderEnabled;
}
exports.UpdateDebtDto = UpdateDebtDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(120),
    __metadata("design:type", String)
], UpdateDebtDto.prototype, "personName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(120),
    __metadata("design:type", String)
], UpdateDebtDto.prototype, "lenderName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(['I_OWE', 'THEY_OWE']),
    __metadata("design:type", String)
], UpdateDebtDto.prototype, "debtType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", String)
], UpdateDebtDto.prototype, "reason", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], UpdateDebtDto.prototype, "principalMinor", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], UpdateDebtDto.prototype, "outstandingMinor", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], UpdateDebtDto.prototype, "minimumDueMinor", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], UpdateDebtDto.prototype, "aprPercent", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], UpdateDebtDto.prototype, "dueDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(['family', 'friend', 'bank', 'fintech', 'other']),
    __metadata("design:type", String)
], UpdateDebtDto.prototype, "relationship", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(['active', 'settled', 'defaulted']),
    __metadata("design:type", String)
], UpdateDebtDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateDebtDto.prototype, "reminderEnabled", void 0);
//# sourceMappingURL=debt.dto.js.map