import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthSession, AuthSessionSchema } from './schemas/auth-session.schema';
import { AccessTokenStrategy } from './strategies/access-token.strategy';
import { RefreshTokenStrategy } from './strategies/refresh-token.strategy';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt-access' }),
    JwtModule.register({}),
    UsersModule,
    MongooseModule.forFeature([{ name: AuthSession.name, schema: AuthSessionSchema }])
  ],
  controllers: [AuthController],
  providers: [AuthService, AccessTokenStrategy, RefreshTokenStrategy],
  exports: [AuthService]
})
export class AuthModule {}
