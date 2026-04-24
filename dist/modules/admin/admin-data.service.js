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
exports.AdminDataService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const user_schema_1 = require("../users/schemas/user.schema");
const transaction_schema_1 = require("../transactions/schemas/transaction.schema");
const debt_schema_1 = require("../debts/schemas/debt.schema");
const scheduled_payment_schema_1 = require("../scheduled-payments/schemas/scheduled-payment.schema");
const ai_chat_log_schema_1 = require("../ai/ai-chat-log.schema");
const app_home_item_schema_1 = require("./schemas/app-home-item.schema");
const subscription_plan_schema_1 = require("./schemas/subscription-plan.schema");
const app_notification_schema_1 = require("../app-notifications/schemas/app-notification.schema");
const financial_plan_schema_1 = require("../plans/schemas/financial-plan.schema");
const user_preference_schema_1 = require("../finance-domain/schemas/user-preference.schema");
const obligation_schema_1 = require("../finance-domain/schemas/obligation.schema");
const community_benchmark_schema_1 = require("../finance-domain/schemas/community-benchmark.schema");
const ai_structured_artifact_schema_1 = require("../finance-domain/schemas/ai-structured-artifact.schema");
const contact_ledger_schema_1 = require("../finance-domain/schemas/contact-ledger.schema");
const savings_goal_schema_1 = require("../finance-domain/schemas/savings-goal.schema");
const note_schema_1 = require("../notes/schemas/note.schema");
const auth_session_schema_1 = require("../auth/schemas/auth-session.schema");
function toPlainJson(value) {
    return JSON.parse(JSON.stringify(value));
}
function pickWritableFields(model, body) {
    const paths = model.schema.paths;
    const out = {};
    for (const [k, v] of Object.entries(body)) {
        if (k === '_id' || k === '__v' || k === 'id') {
            continue;
        }
        if (Object.prototype.hasOwnProperty.call(paths, k)) {
            out[k] = v;
        }
    }
    return out;
}
let AdminDataService = class AdminDataService {
    registry;
    constructor(userModel, transactionModel, debtModel, scheduledPaymentModel, aiChatLogModel, appHomeItemModel, subscriptionPlanModel, appNotificationModel, financialPlanModel, userPreferenceModel, obligationModel, communityBenchmarkModel, aiStructuredArtifactModel, contactLedgerModel, savingsGoalModel, noteModel, authSessionModel) {
        this.registry = new Map([
            [
                'users',
                {
                    meta: {
                        key: 'users',
                        label: 'Users',
                        defaultSort: { field: 'createdAt', direction: -1 }
                    },
                    model: userModel
                }
            ],
            [
                'transactions',
                {
                    meta: {
                        key: 'transactions',
                        label: 'Transactions',
                        defaultSort: { field: 'bookedAt', direction: -1 }
                    },
                    model: transactionModel
                }
            ],
            [
                'debts',
                {
                    meta: { key: 'debts', label: 'Debts', defaultSort: { field: 'dueDate', direction: -1 } },
                    model: debtModel
                }
            ],
            [
                'scheduled_payments',
                {
                    meta: {
                        key: 'scheduled_payments',
                        label: 'Scheduled payments',
                        defaultSort: { field: 'dueDate', direction: -1 }
                    },
                    model: scheduledPaymentModel
                }
            ],
            [
                'ai_chat_logs',
                {
                    meta: {
                        key: 'ai_chat_logs',
                        label: 'AI chat logs',
                        defaultSort: { field: 'createdAt', direction: -1 }
                    },
                    model: aiChatLogModel
                }
            ],
            [
                'app_home_items',
                {
                    meta: {
                        key: 'app_home_items',
                        label: 'App home items',
                        defaultSort: { field: 'sortOrder', direction: 1 }
                    },
                    model: appHomeItemModel
                }
            ],
            [
                'subscription_plans',
                {
                    meta: {
                        key: 'subscription_plans',
                        label: 'Subscription plans',
                        defaultSort: { field: 'sortOrder', direction: 1 }
                    },
                    model: subscriptionPlanModel
                }
            ],
            [
                'app_notifications',
                {
                    meta: {
                        key: 'app_notifications',
                        label: 'App notifications',
                        defaultSort: { field: 'scheduledAt', direction: -1 }
                    },
                    model: appNotificationModel
                }
            ],
            [
                'financial_plans',
                {
                    meta: {
                        key: 'financial_plans',
                        label: 'Financial plans',
                        defaultSort: { field: 'createdAt', direction: -1 }
                    },
                    model: financialPlanModel
                }
            ],
            [
                'user_preferences',
                {
                    meta: {
                        key: 'user_preferences',
                        label: 'User preferences',
                        defaultSort: { field: 'updatedAt', direction: -1 }
                    },
                    model: userPreferenceModel
                }
            ],
            [
                'obligations',
                {
                    meta: {
                        key: 'obligations',
                        label: 'Obligations',
                        defaultSort: { field: 'nextDueAt', direction: -1 }
                    },
                    model: obligationModel
                }
            ],
            [
                'community_benchmarks',
                {
                    meta: {
                        key: 'community_benchmarks',
                        label: 'Community benchmarks',
                        defaultSort: { field: 'periodMonth', direction: -1 }
                    },
                    model: communityBenchmarkModel
                }
            ],
            [
                'ai_structured_artifacts',
                {
                    meta: {
                        key: 'ai_structured_artifacts',
                        label: 'AI structured artifacts',
                        defaultSort: { field: 'createdAt', direction: -1 }
                    },
                    model: aiStructuredArtifactModel
                }
            ],
            [
                'contact_ledgers',
                {
                    meta: {
                        key: 'contact_ledgers',
                        label: 'Contact ledgers',
                        defaultSort: { field: 'lastInteractionAt', direction: -1 }
                    },
                    model: contactLedgerModel
                }
            ],
            [
                'savings_goals',
                {
                    meta: {
                        key: 'savings_goals',
                        label: 'Savings goals',
                        defaultSort: { field: 'createdAt', direction: -1 }
                    },
                    model: savingsGoalModel
                }
            ],
            [
                'notes',
                {
                    meta: { key: 'notes', label: 'Notes', defaultSort: { field: 'dueDate', direction: -1 } },
                    model: noteModel
                }
            ],
            [
                'auth_sessions',
                {
                    meta: {
                        key: 'auth_sessions',
                        label: 'Auth sessions',
                        defaultSort: { field: 'expiresAt', direction: -1 }
                    },
                    model: authSessionModel
                }
            ]
        ]);
    }
    listCollectionMeta() {
        return {
            collections: [...this.registry.values()].map((e) => e.meta).sort((a, b) => a.label.localeCompare(b.label))
        };
    }
    resolve(key) {
        const entry = this.registry.get(key);
        if (!entry) {
            throw new common_1.BadRequestException(`Unknown collection: ${key}`);
        }
        return entry;
    }
    parseObjectId(id) {
        if (!mongoose_2.Types.ObjectId.isValid(id)) {
            throw new common_1.BadRequestException('Invalid document id');
        }
        return new mongoose_2.Types.ObjectId(id);
    }
    async listDocuments(collectionKey, opts) {
        const { model, meta } = this.resolve(collectionKey);
        const page = Math.max(1, opts.page);
        const pageSize = Math.min(200, Math.max(1, opts.pageSize));
        const skip = (page - 1) * pageSize;
        const sortField = meta.defaultSort.field;
        const sortDir = meta.defaultSort.direction;
        const sort = { [sortField]: sortDir };
        if (sortField !== '_id') {
            sort._id = -1;
        }
        const [total, rows] = await Promise.all([
            model.countDocuments().exec(),
            model.find().sort(sort).skip(skip).limit(pageSize).lean().exec()
        ]);
        return {
            collection: collectionKey,
            page,
            pageSize,
            total,
            items: rows.map((r) => toPlainJson(r))
        };
    }
    async getDocument(collectionKey, id) {
        const { model } = this.resolve(collectionKey);
        const _id = this.parseObjectId(id);
        const row = await model.findById(_id).lean().exec();
        if (!row) {
            throw new common_1.NotFoundException();
        }
        return toPlainJson(row);
    }
    async createDocument(collectionKey, body) {
        const { model } = this.resolve(collectionKey);
        const payload = pickWritableFields(model, body);
        try {
            const created = await model.create(payload);
            const lean = await model.findById(created._id).lean().exec();
            return toPlainJson(lean);
        }
        catch (e) {
            const msg = e instanceof Error ? e.message : 'Create failed';
            throw new common_1.BadRequestException(msg);
        }
    }
    async patchDocument(collectionKey, id, body) {
        const { model } = this.resolve(collectionKey);
        const _id = this.parseObjectId(id);
        const $set = pickWritableFields(model, body);
        if (Object.keys($set).length === 0) {
            throw new common_1.BadRequestException('No valid fields to update');
        }
        try {
            const updated = await model
                .findByIdAndUpdate(_id, { $set }, { new: true, runValidators: true })
                .lean()
                .exec();
            if (!updated) {
                throw new common_1.NotFoundException();
            }
            return toPlainJson(updated);
        }
        catch (e) {
            if (e instanceof common_1.NotFoundException) {
                throw e;
            }
            const msg = e instanceof Error ? e.message : 'Update failed';
            throw new common_1.BadRequestException(msg);
        }
    }
    async deleteDocument(collectionKey, id) {
        const { model } = this.resolve(collectionKey);
        const _id = this.parseObjectId(id);
        const res = await model.findByIdAndDelete(_id).exec();
        if (!res) {
            throw new common_1.NotFoundException();
        }
        return { success: true };
    }
};
exports.AdminDataService = AdminDataService;
exports.AdminDataService = AdminDataService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __param(1, (0, mongoose_1.InjectModel)(transaction_schema_1.Transaction.name)),
    __param(2, (0, mongoose_1.InjectModel)(debt_schema_1.Debt.name)),
    __param(3, (0, mongoose_1.InjectModel)(scheduled_payment_schema_1.ScheduledPayment.name)),
    __param(4, (0, mongoose_1.InjectModel)(ai_chat_log_schema_1.AiChatLog.name)),
    __param(5, (0, mongoose_1.InjectModel)(app_home_item_schema_1.AppHomeItem.name)),
    __param(6, (0, mongoose_1.InjectModel)(subscription_plan_schema_1.SubscriptionPlan.name)),
    __param(7, (0, mongoose_1.InjectModel)(app_notification_schema_1.AppNotification.name)),
    __param(8, (0, mongoose_1.InjectModel)(financial_plan_schema_1.FinancialPlan.name)),
    __param(9, (0, mongoose_1.InjectModel)(user_preference_schema_1.UserPreference.name)),
    __param(10, (0, mongoose_1.InjectModel)(obligation_schema_1.Obligation.name)),
    __param(11, (0, mongoose_1.InjectModel)(community_benchmark_schema_1.CommunityBenchmark.name)),
    __param(12, (0, mongoose_1.InjectModel)(ai_structured_artifact_schema_1.AiStructuredArtifact.name)),
    __param(13, (0, mongoose_1.InjectModel)(contact_ledger_schema_1.ContactLedger.name)),
    __param(14, (0, mongoose_1.InjectModel)(savings_goal_schema_1.SavingsGoal.name)),
    __param(15, (0, mongoose_1.InjectModel)(note_schema_1.Note.name)),
    __param(16, (0, mongoose_1.InjectModel)(auth_session_schema_1.AuthSession.name)),
    __metadata("design:paramtypes", [Function, Function, Function, Function, Function, Function, Function, Function, Function, Function, Function, Function, Function, Function, Function, Function, Function])
], AdminDataService);
//# sourceMappingURL=admin-data.service.js.map