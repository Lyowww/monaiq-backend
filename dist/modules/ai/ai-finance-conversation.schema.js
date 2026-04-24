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
exports.AiFinanceConversationSchema = exports.AiFinanceConversation = exports.FinanceChatTurn = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let FinanceChatTurn = class FinanceChatTurn {
    role;
    content;
    at;
};
exports.FinanceChatTurn = FinanceChatTurn;
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: ['user', 'assistant'] }),
    __metadata("design:type", String)
], FinanceChatTurn.prototype, "role", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, maxlength: 32000 }),
    __metadata("design:type", String)
], FinanceChatTurn.prototype, "content", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date, default: () => new Date() }),
    __metadata("design:type", Date)
], FinanceChatTurn.prototype, "at", void 0);
exports.FinanceChatTurn = FinanceChatTurn = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], FinanceChatTurn);
const FinanceChatTurnSchema = mongoose_1.SchemaFactory.createForClass(FinanceChatTurn);
let AiFinanceConversation = class AiFinanceConversation {
    userId;
    title;
    messages;
};
exports.AiFinanceConversation = AiFinanceConversation;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User', required: true, index: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], AiFinanceConversation.prototype, "userId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, maxlength: 200 }),
    __metadata("design:type", String)
], AiFinanceConversation.prototype, "title", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [FinanceChatTurnSchema], default: [] }),
    __metadata("design:type", Array)
], AiFinanceConversation.prototype, "messages", void 0);
exports.AiFinanceConversation = AiFinanceConversation = __decorate([
    (0, mongoose_1.Schema)({ collection: 'ai_finance_conversations', timestamps: true })
], AiFinanceConversation);
exports.AiFinanceConversationSchema = mongoose_1.SchemaFactory.createForClass(AiFinanceConversation);
exports.AiFinanceConversationSchema.index({ userId: 1, updatedAt: -1 });
//# sourceMappingURL=ai-finance-conversation.schema.js.map