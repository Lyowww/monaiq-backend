"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var FcmService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FcmService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const admin = __importStar(require("firebase-admin"));
const user_preferences_service_1 = require("../users/user-preferences.service");
let FcmService = FcmService_1 = class FcmService {
    config;
    userPreferences;
    logger = new common_1.Logger(FcmService_1.name);
    ready = false;
    constructor(config, userPreferences) {
        this.config = config;
        this.userPreferences = userPreferences;
    }
    onModuleInit() {
        const raw = this.config.get('FIREBASE_SERVICE_ACCOUNT_JSON');
        if (!raw?.trim()) {
            this.logger.log('FIREBASE_SERVICE_ACCOUNT_JSON not set; FCM delivery is disabled');
            return;
        }
        try {
            const cred = JSON.parse(raw);
            if (!admin.apps.length) {
                admin.initializeApp({
                    credential: admin.credential.cert(cred)
                });
            }
            this.ready = true;
            this.logger.log('Firebase Admin initialized for FCM');
        }
        catch (e) {
            const m = e instanceof Error ? e.message : String(e);
            this.logger.warn(`Invalid FIREBASE_SERVICE_ACCOUNT_JSON; FCM disabled: ${m}`);
        }
    }
    isEnabled() {
        return this.ready;
    }
    /**
     * Sends a display notification via FCM. Android tokens from Expo are FCM registration tokens.
     * iOS tokens from `expo-notifications` are often APNs device tokens; FCM may reject them unless
     * the app uses Firebase iOS SDK for an FCM registration token.
     */
    async sendToDevice(userId, token, title, body, data) {
        if (!this.ready) {
            return;
        }
        const dataPayload = data &&
            Object.fromEntries(Object.entries(data).map(([k, v]) => [k, String(v)]));
        try {
            await admin.messaging().send({
                token,
                notification: { title, body },
                ...(dataPayload && Object.keys(dataPayload).length > 0 ? { data: dataPayload } : {}),
                android: { priority: 'high' },
                apns: {
                    payload: {
                        aps: {
                            alert: { title, body },
                            sound: 'default'
                        }
                    }
                }
            });
        }
        catch (err) {
            const code = err && typeof err === 'object' && 'code' in err
                ? String(err.code)
                : '';
            const message = err instanceof Error ? err.message : String(err);
            this.logger.warn(`FCM send failed (${code || 'unknown'}): ${message}`);
            if (code === 'messaging/invalid-registration-token' ||
                code === 'messaging/registration-token-not-registered') {
                await this.userPreferences.clearFcmDeviceToken(userId);
            }
        }
    }
};
exports.FcmService = FcmService;
exports.FcmService = FcmService = FcmService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        user_preferences_service_1.UserPreferencesService])
], FcmService);
//# sourceMappingURL=fcm.service.js.map