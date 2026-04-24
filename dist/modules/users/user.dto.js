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
exports.RegisterPushTokenDto = exports.UpdateUserProfileDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
class UserSettingsDto {
    lowBalanceThresholdMinor;
    notificationPayments;
    notificationDebts;
    notificationLowBalance;
    notificationUnusualSpending;
    subscription;
    subscriptionPlanKey;
}
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], UserSettingsDto.prototype, "lowBalanceThresholdMinor", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UserSettingsDto.prototype, "notificationPayments", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UserSettingsDto.prototype, "notificationDebts", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UserSettingsDto.prototype, "notificationLowBalance", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UserSettingsDto.prototype, "notificationUnusualSpending", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: ['free', 'premium'] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(['free', 'premium']),
    __metadata("design:type", String)
], UserSettingsDto.prototype, "subscription", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ nullable: true, description: 'Commercial plan key from admin, or null to clear' }),
    (0, class_validator_1.Allow)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateIf)((_, v) => v !== null && v !== undefined),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(64),
    __metadata("design:type", Object)
], UserSettingsDto.prototype, "subscriptionPlanKey", void 0);
class UpdateUserProfileDto {
    firstName;
    lastName;
    currencyCode;
    settings;
}
exports.UpdateUserProfileDto = UpdateUserProfileDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(80),
    __metadata("design:type", String)
], UpdateUserProfileDto.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(80),
    __metadata("design:type", String)
], UpdateUserProfileDto.prototype, "lastName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: ['AMD', 'USD', 'EUR'] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(['AMD', 'USD', 'EUR']),
    __metadata("design:type", String)
], UpdateUserProfileDto.prototype, "currencyCode", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => UserSettingsDto),
    __metadata("design:type", UserSettingsDto)
], UpdateUserProfileDto.prototype, "settings", void 0);
class RegisterPushTokenDto {
    token;
    pushEnabled;
}
exports.RegisterPushTokenDto = RegisterPushTokenDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Native device push token (FCM on Android; may be APNs on iOS with Expo alone)'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(20),
    __metadata("design:type", String)
], RegisterPushTokenDto.prototype, "token", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'When set, updates pushNotificationsEnabled on user_preferences' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], RegisterPushTokenDto.prototype, "pushEnabled", void 0);
//# sourceMappingURL=user.dto.js.map