"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const mongoose_1 = require("@nestjs/mongoose");
const schedule_1 = require("@nestjs/schedule");
const validate_environment_1 = require("./common/config/validate-environment");
const ai_module_1 = require("./modules/ai/ai.module");
const auth_module_1 = require("./modules/auth/auth.module");
const dashboard_module_1 = require("./modules/dashboard/dashboard.module");
const app_notifications_module_1 = require("./modules/app-notifications/app-notifications.module");
const debts_module_1 = require("./modules/debts/debts.module");
const finance_domain_module_1 = require("./modules/finance-domain/finance-domain.module");
const scheduled_payments_module_1 = require("./modules/scheduled-payments/scheduled-payments.module");
const transactions_module_1 = require("./modules/transactions/transactions.module");
const users_module_1 = require("./modules/users/users.module");
const admin_module_1 = require("./modules/admin/admin.module");
const fx_module_1 = require("./modules/fx/fx.module");
const plans_module_1 = require("./modules/plans/plans.module");
const serve_static_1 = require("@nestjs/serve-static");
const path_1 = require("path");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                cache: true,
                validate: validate_environment_1.validateEnvironment
            }),
            serve_static_1.ServeStaticModule.forRoot({
                // From `dist/`, go to repo root `admin/dist` (Vite build)
                rootPath: (0, path_1.join)(__dirname, '..', '..', 'admin', 'dist'),
                serveRoot: '/admin',
                serveStaticOptions: { index: 'index.html' }
            }),
            mongoose_1.MongooseModule.forRootAsync({
                inject: [config_1.ConfigService],
                useFactory: (configService) => ({
                    uri: configService.getOrThrow('MONGODB_URI')
                })
            }),
            schedule_1.ScheduleModule.forRoot(),
            finance_domain_module_1.FinanceDomainModule,
            users_module_1.UsersModule,
            auth_module_1.AuthModule,
            debts_module_1.DebtsModule,
            scheduled_payments_module_1.ScheduledPaymentsModule,
            app_notifications_module_1.AppNotificationsModule,
            transactions_module_1.TransactionsModule,
            dashboard_module_1.DashboardModule,
            plans_module_1.PlansModule,
            fx_module_1.FxModule,
            ai_module_1.AiModule,
            admin_module_1.AdminModule
        ]
    })
], AppModule);
//# sourceMappingURL=app.module.js.map