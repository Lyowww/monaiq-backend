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
exports.UserSchema = exports.User = void 0;
exports.toUserProfile = toUserProfile;
const mongoose_1 = require("@nestjs/mongoose");
let User = class User {
    email;
    passwordHash;
    firstName;
    lastName;
    currencyCode;
    locale;
    dateOfBirth;
    isEmailVerified;
    isAdmin;
    lastInsightAt;
    /** Notification + assistant preferences; defaults align with fintech spec */
    settings;
};
exports.User = User;
__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: true, lowercase: true, trim: true, index: true }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], User.prototype, "passwordHash", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, trim: true }),
    __metadata("design:type", String)
], User.prototype, "firstName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, trim: true }),
    __metadata("design:type", String)
], User.prototype, "lastName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, default: 'AMD', enum: ['AMD', 'USD', 'EUR'] }),
    __metadata("design:type", String)
], User.prototype, "currencyCode", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, default: 'hy-AM' }),
    __metadata("design:type", String)
], User.prototype, "locale", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Date)
], User.prototype, "dateOfBirth", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, default: false }),
    __metadata("design:type", Boolean)
], User.prototype, "isEmailVerified", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, default: false }),
    __metadata("design:type", Boolean)
], User.prototype, "isAdmin", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], User.prototype, "lastInsightAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: {
            lowBalanceThresholdMinor: { type: Number, default: 0 },
            notificationPayments: { type: Boolean, default: true },
            notificationDebts: { type: Boolean, default: true },
            notificationLowBalance: { type: Boolean, default: true },
            notificationUnusualSpending: { type: Boolean, default: true },
            subscription: { type: String, enum: ['free', 'premium'], default: 'free' },
            subscriptionPlanKey: { type: String, trim: true, lowercase: true }
        },
        _id: false,
        default: () => ({
            lowBalanceThresholdMinor: 0,
            notificationPayments: true,
            notificationDebts: true,
            notificationLowBalance: true,
            notificationUnusualSpending: true,
            subscription: 'free'
        })
    }),
    __metadata("design:type", Object)
], User.prototype, "settings", void 0);
exports.User = User = __decorate([
    (0, mongoose_1.Schema)({
        collection: 'users',
        timestamps: true
    })
], User);
exports.UserSchema = mongoose_1.SchemaFactory.createForClass(User);
function toUserSettings(s) {
    return {
        lowBalanceThresholdMinor: s?.lowBalanceThresholdMinor ?? 0,
        notificationPayments: s?.notificationPayments ?? true,
        notificationDebts: s?.notificationDebts ?? true,
        notificationLowBalance: s?.notificationLowBalance ?? true,
        notificationUnusualSpending: s?.notificationUnusualSpending ?? true,
        subscription: s?.subscription ?? 'free',
        subscriptionPlanKey: s?.subscriptionPlanKey ?? null
    };
}
function toUserProfile(user, includeSettings = false) {
    const base = {
        id: user._id.toString(),
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        currencyCode: user.currencyCode,
        locale: user.locale,
        dateOfBirth: user.dateOfBirth.toISOString(),
        isEmailVerified: user.isEmailVerified,
        isAdmin: user.isAdmin === true
    };
    if (includeSettings) {
        return { ...base, settings: toUserSettings(user.settings) };
    }
    return base;
}
//# sourceMappingURL=user.schema.js.map