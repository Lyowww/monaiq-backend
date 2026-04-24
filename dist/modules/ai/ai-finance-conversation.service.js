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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiFinanceConversationService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const ai_finance_conversation_schema_1 = require("./ai-finance-conversation.schema");
let AiFinanceConversationService = class AiFinanceConversationService {
    model;
    constructor(model) {
        this.model = model;
    }
    previewTitle(message) {
        const t = message.trim();
        if (t.length <= 100) {
            return t;
        }
        return `${t.slice(0, 100)}…`;
    }
    async create(userId, title) {
        return this.model.create({
            userId: new mongoose_2.Types.ObjectId(userId),
            title,
            messages: []
        });
    }
    async requireForUser(userId, conversationId) {
        if (!mongoose_2.Types.ObjectId.isValid(conversationId)) {
            throw new common_1.NotFoundException('Conversation not found');
        }
        const doc = await this.model
            .findOne({
            _id: new mongoose_2.Types.ObjectId(conversationId),
            userId: new mongoose_2.Types.ObjectId(userId)
        })
            .exec();
        if (!doc) {
            throw new common_1.NotFoundException('Conversation not found');
        }
        return doc;
    }
    async listSummaries(userId, limit = 40) {
        const rows = await this.model
            .find({ userId: new mongoose_2.Types.ObjectId(userId) })
            .sort({ updatedAt: -1 })
            .limit(limit)
            .select({ title: 1, updatedAt: 1 })
            .lean()
            .exec();
        return rows.map((r) => {
            const row = r;
            const d = row.updatedAt ?? row.createdAt ?? new Date();
            return {
                id: String(r._id),
                title: r.title,
                updatedAt: d.toISOString()
            };
        });
    }
    async getWithTurns(userId, conversationId) {
        const doc = await this.requireForUser(userId, conversationId);
        const docAny = doc;
        const updatedAt = docAny.updatedAt ?? docAny.createdAt ?? new Date();
        return {
            id: doc._id.toString(),
            title: doc.title,
            updatedAt: updatedAt.toISOString(),
            messages: doc.messages.map((m) => ({
                role: m.role,
                content: m.content,
                at: m.at.toISOString()
            }))
        };
    }
    async appendUserAssistantPair(conversationId, userContent, assistantContent) {
        const now = new Date();
        await this.model.updateOne({ _id: conversationId }, {
            $push: {
                messages: {
                    $each: [
                        { role: 'user', content: userContent, at: now },
                        { role: 'assistant', content: assistantContent, at: now }
                    ]
                }
            },
            $set: { updatedAt: now }
        });
    }
};
exports.AiFinanceConversationService = AiFinanceConversationService;
exports.AiFinanceConversationService = AiFinanceConversationService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(ai_finance_conversation_schema_1.AiFinanceConversation.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], AiFinanceConversationService);
//# sourceMappingURL=ai-finance-conversation.service.js.map