import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
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
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      validate: validateEnvironment
    }),
    ServeStaticModule.forRoot({
      // From `dist/`, go to repo root `admin/dist` (Vite build)
      rootPath: join(__dirname, '..', '..', 'admin', 'dist'),
      serveRoot: '/admin',
      serveStaticOptions: { index: 'index.html' }
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.getOrThrow<string>('MONGODB_URI')
      })
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
