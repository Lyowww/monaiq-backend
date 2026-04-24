import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Debt, DebtSchema } from '../debts/schemas/debt.schema';
import { ScheduledPayment, ScheduledPaymentSchema } from '../scheduled-payments/schemas/scheduled-payment.schema';
import { Transaction, TransactionSchema } from '../transactions/schemas/transaction.schema';
import { UsersModule } from '../users/users.module';
import { User, UserSchema } from '../users/schemas/user.schema';
import { AppNotification, AppNotificationSchema } from './schemas/app-notification.schema';
import { AppNotificationsController } from './app-notifications.controller';
import { AppNotificationsService } from './app-notifications.service';
import { FcmService } from './fcm.service';
import { NotificationCronController } from './notification-cron.controller';
import { NotificationSchedulerService } from './notification-scheduler.service';

@Module({
  imports: [
    UsersModule,
    MongooseModule.forFeature([
      { name: AppNotification.name, schema: AppNotificationSchema },
      { name: User.name, schema: UserSchema },
      { name: Debt.name, schema: DebtSchema },
      { name: Transaction.name, schema: TransactionSchema },
      { name: ScheduledPayment.name, schema: ScheduledPaymentSchema }
    ])
  ],
  controllers: [AppNotificationsController, NotificationCronController],
  providers: [AppNotificationsService, NotificationSchedulerService, FcmService],
  exports: [AppNotificationsService]
})
export class AppNotificationsModule {}
