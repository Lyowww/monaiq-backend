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
exports.AppNotificationSchema = exports.AppNotification = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const user_schema_1 = require("../../users/schemas/user.schema");
let AppNotification = class AppNotification {
    userId;
    type;
    title;
    message;
    scheduledAt;
    isRead;
};
exports.AppNotification = AppNotification;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: user_schema_1.User.name, required: true, index: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], AppNotification.prototype, "userId", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        required: true,
        enum: ['payment_due', 'debt_due', 'low_balance', 'unusual_spending', 'insight', 'general']
    }),
    __metadata("design:type", String)
], AppNotification.prototype, "type", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, trim: true }),
    __metadata("design:type", String)
], AppNotification.prototype, "title", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, trim: true }),
    __metadata("design:type", String)
], AppNotification.prototype, "message", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Date)
], AppNotification.prototype, "scheduledAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, default: false }),
    __metadata("design:type", Boolean)
], AppNotification.prototype, "isRead", void 0);
exports.AppNotification = AppNotification = __decorate([
    (0, mongoose_1.Schema)({
        collection: 'app_notifications',
        timestamps: true
    })
], AppNotification);
exports.AppNotificationSchema = mongoose_1.SchemaFactory.createForClass(AppNotification);
exports.AppNotificationSchema.index({ userId: 1, scheduledAt: -1 });
exports.AppNotificationSchema.index({ userId: 1, isRead: 1 });
//# sourceMappingURL=app-notification.schema.js.map