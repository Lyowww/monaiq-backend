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
exports.UserPreferenceSchema = exports.UserPreference = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const user_schema_1 = require("../../users/schemas/user.schema");
let UserPreference = class UserPreference {
    userId;
    appLanguage;
    ghostModeEnabled;
    pushNotificationsEnabled;
    fcmDeviceToken;
    fcmTokenUpdatedAt;
    /** Net salary / periodic income anchor for “burn rate” (minor units) */
    monthlySalaryAnchorMinor;
    lastGhostGestureAt;
};
exports.UserPreference = UserPreference;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: user_schema_1.User.name, required: true, unique: true, index: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], UserPreference.prototype, "userId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: ['en', 'hy'], default: 'hy' }),
    __metadata("design:type", String)
], UserPreference.prototype, "appLanguage", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, default: false }),
    __metadata("design:type", Boolean)
], UserPreference.prototype, "ghostModeEnabled", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, default: true }),
    __metadata("design:type", Boolean)
], UserPreference.prototype, "pushNotificationsEnabled", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], UserPreference.prototype, "fcmDeviceToken", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], UserPreference.prototype, "fcmTokenUpdatedAt", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], UserPreference.prototype, "monthlySalaryAnchorMinor", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], UserPreference.prototype, "lastGhostGestureAt", void 0);
exports.UserPreference = UserPreference = __decorate([
    (0, mongoose_1.Schema)({
        collection: 'user_preferences',
        timestamps: true
    })
], UserPreference);
exports.UserPreferenceSchema = mongoose_1.SchemaFactory.createForClass(UserPreference);
//# sourceMappingURL=user-preference.schema.js.map