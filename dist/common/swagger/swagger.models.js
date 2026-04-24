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
exports.TranscriptResponseDto = exports.ReceiptOcrResponseDto = exports.DashboardSummaryDto = exports.AiWarningDto = exports.TransactionResponseDto = exports.TransactionRecordDto = exports.SuccessResponseDto = exports.AuthSessionResponseDto = exports.UserProfileDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class UserProfileDto {
    id;
    email;
    firstName;
    lastName;
    currencyCode;
    locale;
    dateOfBirth;
    isEmailVerified;
}
exports.UserProfileDto = UserProfileDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '6807fa8f0d0c6f8ef1f8f123' }),
    __metadata("design:type", String)
], UserProfileDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'user@example.com' }),
    __metadata("design:type", String)
], UserProfileDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Lilit' }),
    __metadata("design:type", String)
], UserProfileDto.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Hakobyan' }),
    __metadata("design:type", String)
], UserProfileDto.prototype, "lastName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: ['AMD', 'USD', 'EUR'], example: 'AMD' }),
    __metadata("design:type", String)
], UserProfileDto.prototype, "currencyCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'hy-AM' }),
    __metadata("design:type", String)
], UserProfileDto.prototype, "locale", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2000-05-12T00:00:00.000Z' }),
    __metadata("design:type", String)
], UserProfileDto.prototype, "dateOfBirth", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: false }),
    __metadata("design:type", Boolean)
], UserProfileDto.prototype, "isEmailVerified", void 0);
class AuthSessionResponseDto {
    user;
    accessToken;
    refreshToken;
    accessTokenExpiresAt;
    refreshTokenExpiresAt;
}
exports.AuthSessionResponseDto = AuthSessionResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: UserProfileDto }),
    __metadata("design:type", UserProfileDto)
], AuthSessionResponseDto.prototype, "user", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], AuthSessionResponseDto.prototype, "accessToken", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], AuthSessionResponseDto.prototype, "refreshToken", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2026-04-22T18:10:00.000Z' }),
    __metadata("design:type", String)
], AuthSessionResponseDto.prototype, "accessTokenExpiresAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2026-05-22T18:10:00.000Z' }),
    __metadata("design:type", String)
], AuthSessionResponseDto.prototype, "refreshTokenExpiresAt", void 0);
class SuccessResponseDto {
    success;
}
exports.SuccessResponseDto = SuccessResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: true }),
    __metadata("design:type", Boolean)
], SuccessResponseDto.prototype, "success", void 0);
class TransactionRecordDto {
    id;
    userId;
    debtId;
    source;
    category;
    direction;
    amountMinor;
    currencyCode;
    bookedAt;
    merchantName;
    notes;
    isTransfer;
    pocket;
}
exports.TransactionRecordDto = TransactionRecordDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '6807fa8f0d0c6f8ef1f8f124' }),
    __metadata("design:type", String)
], TransactionRecordDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '6807fa8f0d0c6f8ef1f8f123' }),
    __metadata("design:type", String)
], TransactionRecordDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '6807fa8f0d0c6f8ef1f8f999' }),
    __metadata("design:type", String)
], TransactionRecordDto.prototype, "debtId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: ['manual', 'ocr', 'voice', 'bank_sync'], example: 'manual' }),
    __metadata("design:type", String)
], TransactionRecordDto.prototype, "source", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'food' }),
    __metadata("design:type", String)
], TransactionRecordDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: ['credit', 'debit'], example: 'debit' }),
    __metadata("design:type", String)
], TransactionRecordDto.prototype, "direction", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 350000 }),
    __metadata("design:type", Number)
], TransactionRecordDto.prototype, "amountMinor", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: ['AMD', 'USD', 'EUR'], example: 'AMD' }),
    __metadata("design:type", String)
], TransactionRecordDto.prototype, "currencyCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2026-04-22T18:10:00.000Z' }),
    __metadata("design:type", String)
], TransactionRecordDto.prototype, "bookedAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'KFC' }),
    __metadata("design:type", String)
], TransactionRecordDto.prototype, "merchantName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Voice quick action' }),
    __metadata("design:type", String)
], TransactionRecordDto.prototype, "notes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: false }),
    __metadata("design:type", Boolean)
], TransactionRecordDto.prototype, "isTransfer", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: ['cash', 'card'], example: 'card' }),
    __metadata("design:type", String)
], TransactionRecordDto.prototype, "pocket", void 0);
class TransactionResponseDto extends TransactionRecordDto {
    quickCommandRaw;
}
exports.TransactionResponseDto = TransactionResponseDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'kfc 3500' }),
    __metadata("design:type", String)
], TransactionResponseDto.prototype, "quickCommandRaw", void 0);
class AiWarningDto {
    noteId;
    title;
    dueDate;
    projectedBalanceMinor;
    totalObligationMinor;
    severity;
    message;
}
exports.AiWarningDto = AiWarningDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '6807fa8f0d0c6f8ef1f8f125' }),
    __metadata("design:type", String)
], AiWarningDto.prototype, "noteId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Rent payment' }),
    __metadata("design:type", String)
], AiWarningDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2026-05-01T00:00:00.000Z' }),
    __metadata("design:type", String)
], AiWarningDto.prototype, "dueDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1800000 }),
    __metadata("design:type", Number)
], AiWarningDto.prototype, "projectedBalanceMinor", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 2500000 }),
    __metadata("design:type", Number)
], AiWarningDto.prototype, "totalObligationMinor", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: ['medium', 'high', 'critical'], example: 'high' }),
    __metadata("design:type", String)
], AiWarningDto.prototype, "severity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Projected balance is short by 700000 AMD minor units before Rent payment becomes due.'
    }),
    __metadata("design:type", String)
], AiWarningDto.prototype, "message", void 0);
class DashboardSummaryDto {
    currencyCode;
    liquidBalanceMinor;
    cardBalanceMinor;
    cashOnHandMinor;
    monthlyInflowMinor;
    monthlyOutflowMinor;
    obligationDueMinor;
    debtPressureScore;
    recentTransactions;
    aiWarnings;
    lastInsightAt;
}
exports.DashboardSummaryDto = DashboardSummaryDto;
__decorate([
    (0, swagger_1.ApiProperty)({ enum: ['AMD', 'USD', 'EUR'], example: 'AMD' }),
    __metadata("design:type", String)
], DashboardSummaryDto.prototype, "currencyCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 4500000 }),
    __metadata("design:type", Number)
], DashboardSummaryDto.prototype, "liquidBalanceMinor", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 3200000 }),
    __metadata("design:type", Number)
], DashboardSummaryDto.prototype, "cardBalanceMinor", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1300000 }),
    __metadata("design:type", Number)
], DashboardSummaryDto.prototype, "cashOnHandMinor", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1200000 }),
    __metadata("design:type", Number)
], DashboardSummaryDto.prototype, "monthlyInflowMinor", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 470000 }),
    __metadata("design:type", Number)
], DashboardSummaryDto.prototype, "monthlyOutflowMinor", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 980000 }),
    __metadata("design:type", Number)
], DashboardSummaryDto.prototype, "obligationDueMinor", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 64 }),
    __metadata("design:type", Number)
], DashboardSummaryDto.prototype, "debtPressureScore", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [TransactionRecordDto] }),
    __metadata("design:type", Array)
], DashboardSummaryDto.prototype, "recentTransactions", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [AiWarningDto] }),
    __metadata("design:type", Array)
], DashboardSummaryDto.prototype, "aiWarnings", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '2026-04-22T06:00:00.000Z' }),
    __metadata("design:type", String)
], DashboardSummaryDto.prototype, "lastInsightAt", void 0);
class ReceiptOcrResponseDto {
    merchantName;
    bookedAtIso;
    amountMinor;
    currencyCode;
    category;
    confidence;
    rawText;
}
exports.ReceiptOcrResponseDto = ReceiptOcrResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Yerevan City' }),
    __metadata("design:type", String)
], ReceiptOcrResponseDto.prototype, "merchantName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2026-04-22T00:00:00.000Z' }),
    __metadata("design:type", String)
], ReceiptOcrResponseDto.prototype, "bookedAtIso", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 245000 }),
    __metadata("design:type", Number)
], ReceiptOcrResponseDto.prototype, "amountMinor", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: ['AMD', 'USD', 'EUR'], example: 'AMD' }),
    __metadata("design:type", String)
], ReceiptOcrResponseDto.prototype, "currencyCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'general' }),
    __metadata("design:type", String)
], ReceiptOcrResponseDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 0.82 }),
    __metadata("design:type", Number)
], ReceiptOcrResponseDto.prototype, "confidence", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Yerevan City AMD 2450 22/04/2026' }),
    __metadata("design:type", String)
], ReceiptOcrResponseDto.prototype, "rawText", void 0);
class TranscriptResponseDto {
    transcript;
}
exports.TranscriptResponseDto = TranscriptResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'kfc 3500' }),
    __metadata("design:type", String)
], TranscriptResponseDto.prototype, "transcript", void 0);
//# sourceMappingURL=swagger.models.js.map