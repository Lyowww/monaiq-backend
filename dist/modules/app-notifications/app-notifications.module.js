"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppNotificationsModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const debt_schema_1 = require("../debts/schemas/debt.schema");
const scheduled_payment_schema_1 = require("../scheduled-payments/schemas/scheduled-payment.schema");
const transaction_schema_1 = require("../transactions/schemas/transaction.schema");
const users_module_1 = require("../users/users.module");
const user_schema_1 = require("../users/schemas/user.schema");
const app_notification_schema_1 = require("./schemas/app-notification.schema");
const app_notifications_controller_1 = require("./app-notifications.controller");
const app_notifications_service_1 = require("./app-notifications.service");
const fcm_service_1 = require("./fcm.service");
const notification_cron_controller_1 = require("./notification-cron.controller");
const notification_scheduler_service_1 = require("./notification-scheduler.service");
let AppNotificationsModule = class AppNotificationsModule {
};
exports.AppNotificationsModule = AppNotificationsModule;
exports.AppNotificationsModule = AppNotificationsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            users_module_1.UsersModule,
            mongoose_1.MongooseModule.forFeature([
                { name: app_notification_schema_1.AppNotification.name, schema: app_notification_schema_1.AppNotificationSchema },
                { name: user_schema_1.User.name, schema: user_schema_1.UserSchema },
                { name: debt_schema_1.Debt.name, schema: debt_schema_1.DebtSchema },
                { name: transaction_schema_1.Transaction.name, schema: transaction_schema_1.TransactionSchema },
                { name: scheduled_payment_schema_1.ScheduledPayment.name, schema: scheduled_payment_schema_1.ScheduledPaymentSchema }
            ])
        ],
        controllers: [app_notifications_controller_1.AppNotificationsController, notification_cron_controller_1.NotificationCronController],
        providers: [app_notifications_service_1.AppNotificationsService, notification_scheduler_service_1.NotificationSchedulerService, fcm_service_1.FcmService],
        exports: [app_notifications_service_1.AppNotificationsService]
    })
], AppNotificationsModule);
//# sourceMappingURL=app-notifications.module.js.map