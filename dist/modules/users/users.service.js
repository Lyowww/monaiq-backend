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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const subscription_plans_service_1 = require("../admin/subscription-plans.service");
const user_schema_1 = require("./schemas/user.schema");
let UsersService = class UsersService {
    userModel;
    subscriptionPlans;
    constructor(userModel, subscriptionPlans) {
        this.userModel = userModel;
        this.subscriptionPlans = subscriptionPlans;
    }
    findByEmail(email) {
        return this.userModel.findOne({ email: email.toLowerCase() }).exec();
    }
    findById(id) {
        return this.userModel.findById(id).exec();
    }
    async updateProfile(userId, dto) {
        const user = await this.userModel.findById(userId).exec();
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        if (dto.firstName !== undefined) {
            user.firstName = dto.firstName;
        }
        if (dto.lastName !== undefined) {
            user.lastName = dto.lastName;
        }
        if (dto.currencyCode !== undefined) {
            user.currencyCode = dto.currencyCode;
        }
        if (dto.settings) {
            let nextSubscription = dto.settings.subscription ?? user.settings?.subscription ?? 'free';
            let nextPlanKey = user.settings?.subscriptionPlanKey;
            if (dto.settings.subscriptionPlanKey !== undefined) {
                const v = dto.settings.subscriptionPlanKey;
                if (v === null || (typeof v === 'string' && v.trim() === '')) {
                    nextPlanKey = undefined;
                    nextSubscription = 'free';
                }
                else {
                    await this.subscriptionPlans.assertActivePlanKey(v);
                    nextPlanKey = v.trim().toLowerCase();
                    nextSubscription = 'premium';
                }
            }
            else if (dto.settings.subscription === 'free') {
                nextPlanKey = undefined;
                nextSubscription = 'free';
            }
            user.settings = {
                lowBalanceThresholdMinor: dto.settings.lowBalanceThresholdMinor ?? user.settings?.lowBalanceThresholdMinor ?? 0,
                notificationPayments: dto.settings.notificationPayments ?? user.settings?.notificationPayments ?? true,
                notificationDebts: dto.settings.notificationDebts ?? user.settings?.notificationDebts ?? true,
                notificationLowBalance: dto.settings.notificationLowBalance ?? user.settings?.notificationLowBalance ?? true,
                notificationUnusualSpending: dto.settings.notificationUnusualSpending ?? user.settings?.notificationUnusualSpending ?? true,
                subscription: nextSubscription,
                subscriptionPlanKey: nextPlanKey
            };
        }
        return user.save();
    }
    async create(input, session) {
        const createdUsers = await this.userModel.create([
            {
                email: input.email,
                passwordHash: input.passwordHash,
                firstName: input.firstName,
                lastName: input.lastName,
                dateOfBirth: input.dateOfBirth,
                isAdmin: input.isAdmin === true,
                currencyCode: 'AMD',
                locale: 'hy-AM',
                isEmailVerified: false
            }
        ], { session });
        const createdUser = createdUsers[0];
        if (!createdUser) {
            throw new Error('Failed to create user');
        }
        return createdUser;
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        subscription_plans_service_1.SubscriptionPlansService])
], UsersService);
//# sourceMappingURL=users.service.js.map