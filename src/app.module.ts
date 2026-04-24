import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { getMongooseModuleOptions } from './common/config/mongoose-connection-options';
import { validateEnvironment } from './common/config/validate-environment';
import { AiModule } from './modules/ai/ai.module';
import { AuthModule } from './modules/auth/auth.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { AppNotificationsModule } from './modules/app-notifications/app-notifications.module';
import { DebtsModule } from './modules/debts/debts.module';
import { FinanceDomainModule } from './modules/finance-domain/finance-domain.module';
import { ScheduledPaymentsModule } from './modules/scheduled-payments/scheduled-payments.module';
import { TransactionsModule } from './modules/transactions/transactions.module';
import { UsersModule } from './modules/users/users.module';
import { AdminModule } from './modules/admin/admin.module';
import { FxModule } from './modules/fx/fx.module';
import { PlansModule } from './modules/plans/plans.module';
import { VercelSwaggerModule } from './vercel/vercel-swagger.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { existsSync } from 'fs';
import { isAbsolute, join, resolve } from 'path';

const isVercelRuntime = Boolean(
  process.env.VERCEL || process.env.VERCEL_ENV
);
const vercelSwaggerOrEmpty = isVercelRuntime ? [VercelSwaggerModule] : [];

/**
 * Optional: serve the admin SPA from this deploy. When admin is a separate static host or origin,
 * leave `ADMIN_SPA_ROOT` unset. Path may be absolute or relative to the backend process cwd.
 */
function resolveAdminSpaRoot(): string | null {
  const raw = process.env.ADMIN_SPA_ROOT?.trim();
  if (!raw) {
    return null;
  }
  return isAbsolute(raw) ? raw : resolve(process.cwd(), raw);
}

const adminSpaPath = resolveAdminSpaRoot();
const adminStaticOrEmpty =
  adminSpaPath && existsSync(adminSpaPath) && existsSync(join(adminSpaPath, 'index.html'))
    ? [
        ServeStaticModule.forRoot({
          rootPath: adminSpaPath,
          serveRoot: '/admin',
          serveStaticOptions: { index: 'index.html' }
        })
      ]
    : [];

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      validate: validateEnvironment
    }),
    ...adminStaticOrEmpty,
    ...vercelSwaggerOrEmpty,
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        getMongooseModuleOptions(configService.getOrThrow<string>('MONGODB_URI'))
    }),
    ScheduleModule.forRoot(),
    FinanceDomainModule,
    UsersModule,
    AuthModule,
    DebtsModule,
    ScheduledPaymentsModule,
    AppNotificationsModule,
    TransactionsModule,
    DashboardModule,
    PlansModule,
    FxModule,
    AiModule,
    AdminModule
  ]
})
export class AppModule {}
