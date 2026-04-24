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
exports.UpdateFinancialPlanDto = exports.CreateFinancialPlanDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class CreateFinancialPlanDto {
    title;
    planType;
    capMinor;
    category;
    targetMinor;
    savedMinor;
    notes;
}
exports.CreateFinancialPlanDto = CreateFinancialPlanDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Keep food under 80k / month' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2),
    (0, class_validator_1.MaxLength)(120),
    __metadata("design:type", String)
], CreateFinancialPlanDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: ['monthly_spend_cap', 'category_spend_cap', 'savings_target'] }),
    (0, class_validator_1.IsEnum)(['monthly_spend_cap', 'category_spend_cap', 'savings_target']),
    __metadata("design:type", String)
], CreateFinancialPlanDto.prototype, "planType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Minor units — spend caps' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(1_000_000_000_000),
    __metadata("design:type", Number)
], CreateFinancialPlanDto.prototype, "capMinor", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(64),
    __metadata("design:type", String)
], CreateFinancialPlanDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Savings goal in minor units' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(1_000_000_000_000),
    __metadata("design:type", Number)
], CreateFinancialPlanDto.prototype, "targetMinor", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(1_000_000_000_000),
    __metadata("design:type", Number)
], CreateFinancialPlanDto.prototype, "savedMinor", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", String)
], CreateFinancialPlanDto.prototype, "notes", void 0);
class UpdateFinancialPlanDto {
    title;
    capMinor;
    category;
    targetMinor;
    savedMinor;
    notes;
    status;
}
exports.UpdateFinancialPlanDto = UpdateFinancialPlanDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2),
    (0, class_validator_1.MaxLength)(120),
    __metadata("design:type", String)
], UpdateFinancialPlanDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(1_000_000_000_000),
    __metadata("design:type", Number)
], UpdateFinancialPlanDto.prototype, "capMinor", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(64),
    __metadata("design:type", String)
], UpdateFinancialPlanDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(1_000_000_000_000),
    __metadata("design:type", Number)
], UpdateFinancialPlanDto.prototype, "targetMinor", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(1_000_000_000_000),
    __metadata("design:type", Number)
], UpdateFinancialPlanDto.prototype, "savedMinor", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", String)
], UpdateFinancialPlanDto.prototype, "notes", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: ['active', 'archived'] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(['active', 'archived']),
    __metadata("design:type", String)
], UpdateFinancialPlanDto.prototype, "status", void 0);
//# sourceMappingURL=plan.dto.js.map