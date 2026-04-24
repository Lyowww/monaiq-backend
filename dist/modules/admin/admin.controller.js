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
exports.AdminController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const admin_guard_1 = require("../../common/guards/admin.guard");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const admin_service_1 = require("./admin.service");
const subscription_plans_service_1 = require("./subscription-plans.service");
const translation_service_1 = require("../ai/translation.service");
const admin_translate_dto_1 = require("./dto/admin-translate.dto");
let AdminController = class AdminController {
    admin;
    subscriptionPlans;
    translation;
    constructor(admin, subscriptionPlans, translation) {
        this.admin = admin;
        this.subscriptionPlans = subscriptionPlans;
        this.translation = translation;
    }
    async translate(body) {
        const translatedText = await this.translation.translate(body.text, body.to);
        return { translatedText };
    }
    summary() {
        return this.admin.dashboardSummary();
    }
    aiLogs(limit = '50') {
        return this.admin.listAiLogs(Number(limit) || 50);
    }
    listHome() {
        return this.admin.adminListHome();
    }
    createHome(_claims, body) {
        return this.admin.createHomeItem(body);
    }
    patchHome(id, body) {
        return this.admin.patchHomeItem(id, body);
    }
    deleteHome(id) {
        return this.admin.deleteHomeItem(id);
    }
    subscriptionFeatures() {
        return this.subscriptionPlans.listFeatureCatalog();
    }
    listSubscriptionPlans() {
        return this.subscriptionPlans.listPlans();
    }
    createSubscriptionPlan(body) {
        return this.subscriptionPlans.createPlan(body);
    }
    patchSubscriptionPlan(id, body) {
        return this.subscriptionPlans.patchPlan(id, body);
    }
    deleteSubscriptionPlan(id) {
        return this.subscriptionPlans.deletePlan(id);
    }
};
exports.AdminController = AdminController;
__decorate([
    (0, common_1.Post)('translate'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Translate text via the translation sidecar (same service the AI module uses)'
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [admin_translate_dto_1.AdminTranslateBodyDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "translate", null);
__decorate([
    (0, common_1.Get)('summary'),
    (0, swagger_1.ApiOperation)({ summary: 'High-level app metrics' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "summary", null);
__decorate([
    (0, common_1.Get)('ai-logs'),
    (0, swagger_1.ApiOperation)({ summary: 'Recent user prompts to the finance assistant' }),
    __param(0, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "aiLogs", null);
__decorate([
    (0, common_1.Get)('home-items'),
    (0, swagger_1.ApiOperation)({ summary: 'Home / services rows (raw DB, admin only)' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "listHome", null);
__decorate([
    (0, common_1.Post)('home-items'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "createHome", null);
__decorate([
    (0, common_1.Patch)('home-items/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "patchHome", null);
__decorate([
    (0, common_1.Delete)('home-items/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "deleteHome", null);
__decorate([
    (0, common_1.Get)('subscription-features'),
    (0, swagger_1.ApiOperation)({ summary: 'Catalog of feature flags available for subscription plans' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "subscriptionFeatures", null);
__decorate([
    (0, common_1.Get)('subscription-plans'),
    (0, swagger_1.ApiOperation)({ summary: 'List configured subscription plans' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "listSubscriptionPlans", null);
__decorate([
    (0, common_1.Post)('subscription-plans'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a subscription plan' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "createSubscriptionPlan", null);
__decorate([
    (0, common_1.Patch)('subscription-plans/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update a subscription plan' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "patchSubscriptionPlan", null);
__decorate([
    (0, common_1.Delete)('subscription-plans/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a subscription plan' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "deleteSubscriptionPlan", null);
exports.AdminController = AdminController = __decorate([
    (0, swagger_1.ApiTags)('admin'),
    (0, swagger_1.ApiBearerAuth)('bearer'),
    (0, common_1.Controller)('admin'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, admin_guard_1.AdminGuard),
    __metadata("design:paramtypes", [admin_service_1.AdminService,
        subscription_plans_service_1.SubscriptionPlansService,
        translation_service_1.TranslationService])
], AdminController);
//# sourceMappingURL=admin.controller.js.map