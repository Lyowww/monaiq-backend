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
exports.NotificationCronController = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const swagger_1 = require("@nestjs/swagger");
const notification_scheduler_service_1 = require("./notification-scheduler.service");
let NotificationCronController = class NotificationCronController {
    configService;
    notificationSchedulerService;
    constructor(configService, notificationSchedulerService) {
        this.configService = configService;
        this.notificationSchedulerService = notificationSchedulerService;
    }
    async run(authorization) {
        const cronSecret = this.configService.get('CRON_SECRET');
        if (process.env.NODE_ENV === 'production' && !cronSecret) {
            throw new common_1.ServiceUnavailableException('CRON_SECRET must be configured for production cron execution');
        }
        if (cronSecret && authorization !== `Bearer ${cronSecret}`) {
            throw new common_1.UnauthorizedException('Invalid cron secret');
        }
        await this.notificationSchedulerService.runDailyReminders();
        return {
            success: true,
            triggeredAt: new Date().toISOString()
        };
    }
};
exports.NotificationCronController = NotificationCronController;
__decorate([
    (0, common_1.Get)('notifications'),
    __param(0, (0, common_1.Headers)('authorization')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], NotificationCronController.prototype, "run", null);
exports.NotificationCronController = NotificationCronController = __decorate([
    (0, swagger_1.ApiExcludeController)(),
    (0, common_1.Controller)('internal/cron'),
    __metadata("design:paramtypes", [config_1.ConfigService,
        notification_scheduler_service_1.NotificationSchedulerService])
], NotificationCronController);
//# sourceMappingURL=notification-cron.controller.js.map