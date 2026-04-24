import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminModule } from '../admin/admin.module';
import { FinanceDomainModule } from '../finance-domain/finance-domain.module';
import { User, UserSchema } from './schemas/user.schema';
import { UserPreferencesService } from './user-preferences.service';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    FinanceDomainModule,
    AdminModule
  ],
  controllers: [UsersController],
  providers: [UsersService, UserPreferencesService],
  exports: [UsersService, UserPreferencesService, MongooseModule]
})
export class UsersModule {}
