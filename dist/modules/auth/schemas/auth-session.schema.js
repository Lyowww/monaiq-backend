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
exports.AuthSessionSchema = exports.AuthSession = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const user_schema_1 = require("../../users/schemas/user.schema");
let AuthSession = class AuthSession {
    userId;
    familyId;
    deviceName;
    refreshTokenHash;
    userAgent;
    ipAddress;
    expiresAt;
    lastUsedAt;
    revokedAt;
};
exports.AuthSession = AuthSession;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: user_schema_1.User.name, required: true, index: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], AuthSession.prototype, "userId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, index: true }),
    __metadata("design:type", String)
], AuthSession.prototype, "familyId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], AuthSession.prototype, "deviceName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], AuthSession.prototype, "refreshTokenHash", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], AuthSession.prototype, "userAgent", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], AuthSession.prototype, "ipAddress", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, index: true }),
    __metadata("design:type", Date)
], AuthSession.prototype, "expiresAt", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], AuthSession.prototype, "lastUsedAt", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], AuthSession.prototype, "revokedAt", void 0);
exports.AuthSession = AuthSession = __decorate([
    (0, mongoose_1.Schema)({
        collection: 'auth_sessions',
        timestamps: true
    })
], AuthSession);
exports.AuthSessionSchema = mongoose_1.SchemaFactory.createForClass(AuthSession);
exports.AuthSessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
exports.AuthSessionSchema.index({ userId: 1, familyId: 1 });
//# sourceMappingURL=auth-session.schema.js.map