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
exports.UserPreferencesService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const user_preference_schema_1 = require("../finance-domain/schemas/user-preference.schema");
let UserPreferencesService = class UserPreferencesService {
    prefModel;
    constructor(prefModel) {
        this.prefModel = prefModel;
    }
    async setFcmToken(userId, token, pushEnabled) {
        const setFields = {
            fcmDeviceToken: token.trim(),
            fcmTokenUpdatedAt: new Date()
        };
        if (typeof pushEnabled === 'boolean') {
            setFields.pushNotificationsEnabled = pushEnabled;
        }
        await this.prefModel
            .findOneAndUpdate({ userId: new mongoose_2.Types.ObjectId(userId) }, {
            $set: setFields,
            $setOnInsert: {
                userId: new mongoose_2.Types.ObjectId(userId),
                appLanguage: 'hy',
                ghostModeEnabled: false,
                pushNotificationsEnabled: true
            }
        }, { upsert: true })
            .exec();
    }
    async getPushTarget(userId) {
        const doc = await this.prefModel.findOne({ userId: new mongoose_2.Types.ObjectId(userId) }).exec();
        if (!doc?.fcmDeviceToken?.trim()) {
            return null;
        }
        if (doc.pushNotificationsEnabled === false) {
            return null;
        }
        return { token: doc.fcmDeviceToken.trim() };
    }
    async clearFcmDeviceToken(userId) {
        await this.prefModel
            .updateOne({ userId: new mongoose_2.Types.ObjectId(userId) }, { $unset: { fcmDeviceToken: 1, fcmTokenUpdatedAt: 1 } })
            .exec();
    }
};
exports.UserPreferencesService = UserPreferencesService;
exports.UserPreferencesService = UserPreferencesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_preference_schema_1.UserPreference.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], UserPreferencesService);
//# sourceMappingURL=user-preferences.service.js.map