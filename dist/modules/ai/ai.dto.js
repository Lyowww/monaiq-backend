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
exports.OpenRouterChatDto = exports.FinanceChatDto = exports.ReceiptOcrDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class ReceiptOcrDto {
    rawText;
}
exports.ReceiptOcrDto = ReceiptOcrDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Yerevan City AMD 2450 22/04/2026' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ReceiptOcrDto.prototype, "rawText", void 0);
class FinanceChatDto {
    message;
    /** Continue an existing thread; omit to start a new saved conversation. */
    conversationId;
    /** Matches app UI: English vs Eastern Armenian assistant replies. */
    replyLanguage;
}
exports.FinanceChatDto = FinanceChatDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Can I buy headphones for 50,000 dram this week?' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(1),
    (0, class_validator_1.MaxLength)(4000),
    __metadata("design:type", String)
], FinanceChatDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsMongoId)(),
    __metadata("design:type", String)
], FinanceChatDto.prototype, "conversationId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, enum: ['en', 'hy'], default: 'en' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(['en', 'hy']),
    __metadata("design:type", String)
], FinanceChatDto.prototype, "replyLanguage", void 0);
class OpenRouterChatDto {
    message;
    /** When `hy`, the message is translated to English for the model and the streamed reply is translated back to Armenian. */
    replyLanguage;
}
exports.OpenRouterChatDto = OpenRouterChatDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'How many r\'s are in the word "strawberry"?' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(1),
    (0, class_validator_1.MaxLength)(8000),
    __metadata("design:type", String)
], OpenRouterChatDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, enum: ['en', 'hy'], default: 'en' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(['en', 'hy']),
    __metadata("design:type", String)
], OpenRouterChatDto.prototype, "replyLanguage", void 0);
//# sourceMappingURL=ai.dto.js.map