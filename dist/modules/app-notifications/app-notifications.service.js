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
exports.AppNotificationsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const user_preferences_service_1 = require("../users/user-preferences.service");
const app_notification_schema_1 = require("./schemas/app-notification.schema");
const fcm_service_1 = require("./fcm.service");
let AppNotificationsService = class AppNotificationsService {
    notificationModel;
    userPreferences;
    fcm;
    constructor(notificationModel, userPreferences, fcm) {
        this.notificationModel = notificationModel;
        this.userPreferences = userPreferences;
        this.fcm = fcm;
    }
    map(n) {
        return {
            id: n._id.toString(),
            userId: n.userId.toString(),
            type: n.type,
            title: n.title,
            message: n.message,
            scheduledAt: n.scheduledAt.toISOString(),
            isRead: n.isRead
        };
    }
    listForUser(userId, unreadOnly) {
        const q = { userId: new mongoose_2.Types.ObjectId(userId) };
        if (unreadOnly) {
            q.isRead = false;
        }
        return this.notificationModel.find(q).sort({ scheduledAt: -1 }).limit(100).exec();
    }
    async markRead(userId, id) {
        const doc = await this.notificationModel
            .findOneAndUpdate({ _id: new mongoose_2.Types.ObjectId(id), userId: new mongoose_2.Types.ObjectId(userId) }, { isRead: true }, { new: true })
            .exec();
        if (!doc) {
            throw new common_1.NotFoundException('Notification not found');
        }
        return doc;
    }
    async createIfNew(userId, payload) {
        const since = new Date(Date.now() - 36 * 60 * 60 * 1000);
        const dup = await this.notificationModel
            .findOne({
            userId: new mongoose_2.Types.ObjectId(userId),
            type: payload.type,
            title: payload.title,
            scheduledAt: { $gte: since }
        })
            .exec();
        if (dup) {
            return null;
        }
        const [created] = await this.notificationModel.create([
            {
                userId: new mongoose_2.Types.ObjectId(userId),
                type: payload.type,
                title: payload.title,
                message: payload.message,
                scheduledAt: payload.scheduledAt,
                isRead: false
            }
        ]);
        if (!created) {
            return null;
        }
        const target = await this.userPreferences.getPushTarget(userId);
        if (target && this.fcm.isEnabled()) {
            await this.fcm.sendToDevice(userId, target.token, payload.title, payload.message, {
                type: payload.type
            });
        }
        return created;
    }
};
exports.AppNotificationsService = AppNotificationsService;
exports.AppNotificationsService = AppNotificationsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(app_notification_schema_1.AppNotification.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        user_preferences_service_1.UserPreferencesService,
        fcm_service_1.FcmService])
], AppNotificationsService);
//# sourceMappingURL=app-notifications.service.js.map