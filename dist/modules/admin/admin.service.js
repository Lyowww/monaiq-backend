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
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const user_schema_1 = require("../users/schemas/user.schema");
const transaction_schema_1 = require("../transactions/schemas/transaction.schema");
const ai_chat_log_schema_1 = require("../ai/ai-chat-log.schema");
const app_home_item_schema_1 = require("./schemas/app-home-item.schema");
const BUILTIN_HOME = [
    {
        key: 'analytics',
        titleHy: 'Վերլուծություն',
        titleEn: 'Analytics',
        subtitleHy: 'Ծախս, մուտք, կատեգորիա',
        subtitleEn: 'Spending, inflow, categories',
        route: '/(app)/(tabs)/stats',
        iconName: 'stats-chart',
        sortOrder: 0
    },
    {
        key: 'assistant',
        titleHy: 'Օգնական',
        titleEn: 'Assistant',
        subtitleHy: 'Կանոնավոր ֆինանս հարցեր',
        subtitleEn: 'Budget and cash questions',
        route: '/(app)/(tabs)/assistant',
        iconName: 'chatbubble-ellipses',
        sortOrder: 1
    }
];
let AdminService = class AdminService {
    userModel;
    txModel;
    aiLogModel;
    homeItemModel;
    constructor(userModel, txModel, aiLogModel, homeItemModel) {
        this.userModel = userModel;
        this.txModel = txModel;
        this.aiLogModel = aiLogModel;
        this.homeItemModel = homeItemModel;
    }
    async dashboardSummary() {
        const [users, txCount, aiLogs, lastTx] = await Promise.all([
            this.userModel.countDocuments().exec(),
            this.txModel.countDocuments().exec(),
            this.aiLogModel.countDocuments().exec(),
            this.txModel.findOne().sort({ _id: -1 }).lean().exec()
        ]);
        const today = new Date();
        today.setUTCHours(0, 0, 0, 0);
        const aiToday = await this.aiLogModel
            .countDocuments({ createdAt: { $gte: today } })
            .exec();
        const created = lastTx;
        const lastAt = created?.createdAt ?? (created && 'bookedAt' in created ? created.bookedAt : undefined);
        return {
            users,
            transactions: txCount,
            aiChatMessages: aiLogs,
            aiChatMessagesToday: aiToday,
            lastActivityAt: lastAt ? new Date(lastAt).toISOString() : null
        };
    }
    async listAiLogs(limit) {
        const n = Math.min(200, Math.max(1, limit));
        const rows = await this.aiLogModel
            .find()
            .sort({ createdAt: -1 })
            .limit(n)
            .lean()
            .exec();
        return rows.map((r) => {
            const o = r;
            return {
                id: o._id.toString(),
                userId: o.userId.toString(),
                messagePreview: o.messagePreview,
                charCount: o.charCount,
                createdAt: (o.createdAt ?? new Date(0)).toISOString()
            };
        });
    }
    async listHomeItemsResolved() {
        return this.mergedHomeItems();
    }
    async mergedHomeItems() {
        const db = await this.homeItemModel.find().sort({ sortOrder: 1 }).lean().exec();
        if (db.length > 0) {
            return db.map((d) => ({
                id: d._id.toString(),
                key: d.key,
                titleHy: d.titleHy,
                titleEn: d.titleEn,
                subtitleHy: d.subtitleHy,
                subtitleEn: d.subtitleEn,
                route: d.route,
                iconName: d.iconName,
                sortOrder: d.sortOrder,
                enabled: d.enabled
            }));
        }
        return BUILTIN_HOME.map((b, i) => ({
            id: `builtin-${b.key}`,
            key: b.key,
            titleHy: b.titleHy,
            titleEn: b.titleEn,
            subtitleHy: b.subtitleHy,
            subtitleEn: b.subtitleEn,
            route: b.route,
            iconName: b.iconName,
            sortOrder: b.sortOrder ?? i,
            enabled: true
        }));
    }
    adminListHome() {
        return this.homeItemModel.find().sort({ sortOrder: 1 }).lean().exec();
    }
    async createHomeItem(body) {
        const created = await this.homeItemModel.create({
            key: body.key.trim(),
            titleHy: body.titleHy,
            titleEn: body.titleEn,
            subtitleHy: body.subtitleHy,
            subtitleEn: body.subtitleEn,
            route: body.route,
            iconName: body.iconName ?? 'sparkles',
            sortOrder: body.sortOrder ?? 0,
            enabled: body.enabled !== false
        });
        return created;
    }
    async patchHomeItem(id, patch) {
        const doc = await this.homeItemModel
            .findByIdAndUpdate(new mongoose_2.Types.ObjectId(id), { $set: patch }, { new: true })
            .exec();
        if (!doc) {
            throw new common_1.NotFoundException();
        }
        return doc;
    }
    async deleteHomeItem(id) {
        const res = await this.homeItemModel.findByIdAndDelete(new mongoose_2.Types.ObjectId(id)).exec();
        if (!res) {
            throw new common_1.NotFoundException();
        }
        return { success: true };
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __param(1, (0, mongoose_1.InjectModel)(transaction_schema_1.Transaction.name)),
    __param(2, (0, mongoose_1.InjectModel)(ai_chat_log_schema_1.AiChatLog.name)),
    __param(3, (0, mongoose_1.InjectModel)(app_home_item_schema_1.AppHomeItem.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], AdminService);
//# sourceMappingURL=admin.service.js.map