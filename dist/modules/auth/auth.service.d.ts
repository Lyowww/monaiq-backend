import { ConfigService } from '@nestjs/config';
import type { AuthSessionResponse } from '@ai-finance/shared-types';
import { JwtService } from '@nestjs/jwt';
import { Connection, Model } from 'mongoose';
import { UsersService } from '../users/users.service';
import { LoginDto, RegisterDto } from './auth.dto';
import { AuthSession } from './schemas/auth-session.schema';
import type { AccessTokenClaims, RefreshTokenClaims, RefreshTokenClaimsWithRawToken, RequestMeta } from './auth.types';
export declare class AuthService {
    private readonly configService;
    private readonly jwtService;
    private readonly usersService;
    private readonly authSessionModel;
    private readonly connection;
    constructor(configService: ConfigService, jwtService: JwtService, usersService: UsersService, authSessionModel: Model<AuthSession>, connection: Connection);
    register(dto: RegisterDto, meta: RequestMeta): Promise<AuthSessionResponse>;
    login(dto: LoginDto, meta: RequestMeta): Promise<AuthSessionResponse>;
    refreshSession(claims: RefreshTokenClaimsWithRawToken, meta: RequestMeta): Promise<AuthSessionResponse>;
    logout(claims: RefreshTokenClaims): Promise<{
        success: true;
    }>;
    me(claims: AccessTokenClaims): Promise<import("@ai-finance/shared-types").UserProfile>;
    private createAuthSession;
    private securePasswordMatch;
    /** Ensures a DB user exists for env-based admin login (refresh tokens need a real user id). */
    private ensureEnvAdminUser;
    private isAdminUser;
    private issueTokens;
    private ensureAgeGate;
    private calculateAccessExpiration;
    private calculateRefreshExpiration;
}
