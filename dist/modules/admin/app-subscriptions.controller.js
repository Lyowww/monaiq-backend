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
exports.AppSubscriptionsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const subscription_plans_service_1 = require("./subscription-plans.service");
let AppSubscriptionsController = class AppSubscriptionsController {
    subscriptionPlans;
    constructor(subscriptionPlans) {
        this.subscriptionPlans = subscriptionPlans;
    }
    plans() {
        return this.subscriptionPlans.listPublicPlans();
    }
    features() {
        return this.subscriptionPlans.listFeatureCatalog();
    }
};
exports.AppSubscriptionsController = AppSubscriptionsController;
__decorate([
    (0, common_1.Get)('plans'),
    (0, swagger_1.ApiOperation)({ summary: 'Active subscription plans for the mobile app (public)' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AppSubscriptionsController.prototype, "plans", null);
__decorate([
    (0, common_1.Get)('features'),
    (0, swagger_1.ApiOperation)({ summary: 'Feature catalog labels for paywall UI (public)' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AppSubscriptionsController.prototype, "features", null);
exports.AppSubscriptionsController = AppSubscriptionsController = __decorate([
    (0, swagger_1.ApiTags)('app-subscriptions'),
    (0, common_1.Controller)('app/subscriptions'),
    __metadata("design:paramtypes", [subscription_plans_service_1.SubscriptionPlansService])
], AppSubscriptionsController);
//# sourceMappingURL=app-subscriptions.controller.js.map