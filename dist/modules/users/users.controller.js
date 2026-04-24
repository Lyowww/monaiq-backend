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
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const swagger_models_1 = require("../../common/swagger/swagger.models");
const user_schema_1 = require("./schemas/user.schema");
const user_dto_1 = require("./user.dto");
const subscription_plans_service_1 = require("../admin/subscription-plans.service");
const user_preferences_service_1 = require("./user-preferences.service");
const users_service_1 = require("./users.service");
let UsersController = class UsersController {
    usersService;
    userPreferencesService;
    subscriptionPlans;
    constructor(usersService, userPreferencesService, subscriptionPlans) {
        this.usersService = usersService;
        this.userPreferencesService = userPreferencesService;
        this.subscriptionPlans = subscriptionPlans;
    }
    async me(claims) {
        const user = await this.usersService.findById(claims.sub);
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        const entitledFeatureIds = await this.subscriptionPlans.getEntitledFeatureIdsForUser(user);
        return { ...(0, user_schema_1.toUserProfile)(user, true), entitledFeatureIds };
    }
    async patchMe(claims, dto) {
        const user = await this.usersService.updateProfile(claims.sub, dto);
        const entitledFeatureIds = await this.subscriptionPlans.getEntitledFeatureIdsForUser(user);
        return { ...(0, user_schema_1.toUserProfile)(user, true), entitledFeatureIds };
    }
    async registerPushToken(claims, dto) {
        await this.userPreferencesService.setFcmToken(claims.sub, dto.token, dto.pushEnabled);
    }
};
exports.UsersController = UsersController;
__decorate([
    (0, common_1.Get)('me'),
    (0, swagger_1.ApiOperation)({ summary: 'Current user profile and settings' }),
    (0, swagger_1.ApiOkResponse)({ type: swagger_models_1.UserProfileDto }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "me", null);
__decorate([
    (0, common_1.Patch)('me'),
    (0, swagger_1.ApiOperation)({ summary: 'Update profile and notification preferences' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, user_dto_1.UpdateUserProfileDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "patchMe", null);
__decorate([
    (0, common_1.Post)('me/push-token'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Register FCM / native device token for push notifications' }),
    (0, swagger_1.ApiBody)({ type: user_dto_1.RegisterPushTokenDto }),
    (0, swagger_1.ApiNoContentResponse)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, user_dto_1.RegisterPushTokenDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "registerPushToken", null);
exports.UsersController = UsersController = __decorate([
    (0, swagger_1.ApiTags)('Users'),
    (0, swagger_1.ApiBearerAuth)('bearer'),
    (0, common_1.Controller)('users'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        user_preferences_service_1.UserPreferencesService,
        subscription_plans_service_1.SubscriptionPlansService])
], UsersController);
//# sourceMappingURL=users.controller.js.map