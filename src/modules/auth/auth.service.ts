import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import type { AuthSessionResponse } from '@ai-finance/shared-types';
import * as argon2 from 'argon2';
import { randomUUID, timingSafeEqual } from 'crypto';
import { JwtService } from '@nestjs/jwt';
import { ClientSession, Connection, Model, Types } from 'mongoose';
import { UsersService } from '../users/users.service';
import { toUserProfile, type UserDocument } from '../users/schemas/user.schema';
import { LoginDto, RegisterDto } from './auth.dto';
import { AuthSession, type AuthSessionDocument } from './schemas/auth-session.schema';
import type {
  AccessTokenClaims,
  RefreshTokenClaims,
  RefreshTokenClaimsWithRawToken,
  RequestMeta
} from './auth.types';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    @InjectModel(AuthSession.name)
    private readonly authSessionModel: Model<AuthSession>,
    @InjectConnection() private readonly connection: Connection
  ) {}

  async register(dto: RegisterDto, meta: RequestMeta): Promise<AuthSessionResponse> {
    this.ensureAgeGate(dto.dateOfBirth);

    const existingUser = await this.usersService.findByEmail(dto.email);
    if (existingUser) {
      throw new ConflictException('Email is already registered');
    }

    const passwordHash = await argon2.hash(dto.password);
    const mongoSession = await this.connection.startSession();

    try {
      mongoSession.startTransaction();

      const user = await this.usersService.create(
        {
          email: dto.email.toLowerCase(),
          passwordHash,
          firstName: dto.firstName.trim(),
          lastName: dto.lastName.trim(),
          dateOfBirth: new Date(dto.dateOfBirth)
        },
        mongoSession
      );

      const authSession = await this.createAuthSession(user._id, meta, mongoSession);
      const authResponse = await this.issueTokens(user, authSession, mongoSession);

      await mongoSession.commitTransaction();
      return authResponse;
    } catch (error) {
      await mongoSession.abortTransaction();
      throw error;
    } finally {
      await mongoSession.endSession();
    }
  }

  async login(dto: LoginDto, meta: RequestMeta): Promise<AuthSessionResponse> {
    const envEmailRaw = this.configService.get<string>('ADMIN_LOGIN_EMAIL');
    const envPassword = this.configService.get<string>('ADMIN_LOGIN_PASSWORD');
    const envEmail =
      typeof envEmailRaw === 'string' && envEmailRaw.trim().length > 0
        ? envEmailRaw.trim().toLowerCase()
        : null;

    if (envEmail && envPassword && envPassword.length > 0) {
      const triedEmail = dto.email.trim().toLowerCase();
      if (triedEmail === envEmail) {
        if (!this.securePasswordMatch(dto.password, envPassword)) {
          throw new UnauthorizedException('Invalid email or password');
        }
        const user = await this.ensureEnvAdminUser(envEmail);
        const authSession = await this.createAuthSession(user._id, meta);
        return this.issueTokens(user, authSession);
      }
    }

    const user = await this.usersService.findByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const passwordMatches = await argon2.verify(user.passwordHash, dto.password);
    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const authSession = await this.createAuthSession(user._id, meta);
    return this.issueTokens(user, authSession);
  }

  async refreshSession(
    claims: RefreshTokenClaimsWithRawToken,
    meta: RequestMeta
  ): Promise<AuthSessionResponse> {
    const authSession = await this.authSessionModel.findById(claims.sessionId).exec();
    if (!authSession || authSession.userId.toString() !== claims.sub || authSession.revokedAt) {
      throw new UnauthorizedException('Refresh session is not valid');
    }

    if (authSession.expiresAt.getTime() <= Date.now()) {
      throw new UnauthorizedException('Refresh token has expired');
    }

    const isCurrentToken = await argon2.verify(authSession.refreshTokenHash, claims.refreshToken);
    if (!isCurrentToken) {
      await this.authSessionModel
        .updateMany(
          {
            userId: new Types.ObjectId(claims.sub),
            familyId: claims.familyId,
            revokedAt: null
          },
          {
            $set: {
              revokedAt: new Date()
            }
          }
        )
        .exec();

      throw new UnauthorizedException('Refresh token reuse detected');
    }

    const user = await this.usersService.findById(claims.sub);
    if (!user) {
      throw new UnauthorizedException('User was not found');
    }

    authSession.deviceName = meta.deviceName;
    authSession.userAgent = meta.userAgent;
    authSession.ipAddress = meta.ipAddress;

    return this.issueTokens(user, authSession);
  }

  async logout(claims: RefreshTokenClaims): Promise<{ success: true }> {
    await this.authSessionModel
      .findByIdAndUpdate(claims.sessionId, {
        revokedAt: new Date()
      })
      .exec();

    return { success: true };
  }

  async me(claims: AccessTokenClaims) {
    const user = await this.usersService.findById(claims.sub);
    if (!user) {
      throw new UnauthorizedException('User session is invalid');
    }

    return toUserProfile(user);
  }

  private async createAuthSession(
    userId: Types.ObjectId,
    meta: RequestMeta,
    session?: ClientSession
  ): Promise<AuthSessionDocument> {
    const refreshTokenHash = await argon2.hash(randomUUID());
    const createdSessions = await this.authSessionModel.create(
      [
        {
          userId,
          familyId: randomUUID(),
          deviceName: meta.deviceName,
          userAgent: meta.userAgent,
          ipAddress: meta.ipAddress,
          refreshTokenHash,
          expiresAt: this.calculateRefreshExpiration()
        }
      ],
      session ? { session } : undefined
    );

    const authSession = createdSessions[0];
    if (!authSession) {
      throw new UnauthorizedException('Failed to create auth session');
    }

    return authSession;
  }

  private securePasswordMatch(plain: string, expected: string): boolean {
    const a = Buffer.from(plain, 'utf8');
    const b = Buffer.from(expected, 'utf8');
    if (a.length !== b.length) {
      return false;
    }
    return timingSafeEqual(a, b);
  }

  /** Ensures a DB user exists for env-based admin login (refresh tokens need a real user id). */
  private async ensureEnvAdminUser(email: string): Promise<UserDocument> {
    const user = await this.usersService.findByEmail(email);
    if (user) {
      if (!user.isAdmin) {
        user.isAdmin = true;
        await user.save();
      }
      return user;
    }
    const passwordHash = await argon2.hash(randomUUID());
    return this.usersService.create({
      email,
      passwordHash,
      firstName: 'MonAIQ',
      lastName: 'Admin',
      dateOfBirth: new Date('1990-01-01T00:00:00.000Z'),
      isAdmin: true
    });
  }

  private isAdminUser(user: UserDocument): boolean {
    if (user.isAdmin) {
      return true;
    }
    const raw = this.configService.get<string>('ADMIN_EMAILS') ?? '';
    const list = raw
      .split(',')
      .map((s) => s.trim().toLowerCase())
      .filter((s) => s.length > 0);
    return list.includes(user.email.toLowerCase());
  }

  private async issueTokens(
    user: UserDocument,
    authSession: AuthSessionDocument,
    session?: ClientSession
  ): Promise<AuthSessionResponse> {
    const accessTokenExpiresAt = this.calculateAccessExpiration();
    const refreshTokenExpiresAt = this.calculateRefreshExpiration();

    const accessPayload: AccessTokenClaims = {
      sub: user._id.toString(),
      email: user.email,
      sessionId: authSession._id.toString(),
      type: 'access',
      isAdmin: this.isAdminUser(user)
    };

    const refreshPayload: RefreshTokenClaims = {
      sub: user._id.toString(),
      email: user.email,
      sessionId: authSession._id.toString(),
      familyId: authSession.familyId,
      type: 'refresh'
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(accessPayload, {
        secret: this.configService.getOrThrow<string>('JWT_ACCESS_SECRET'),
        expiresIn: `${this.configService.getOrThrow<number>('JWT_ACCESS_TTL_MINUTES')}m`
      }),
      this.jwtService.signAsync(refreshPayload, {
        secret: this.configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
        expiresIn: `${this.configService.getOrThrow<number>('JWT_REFRESH_TTL_DAYS')}d`
      })
    ]);

    authSession.refreshTokenHash = await argon2.hash(refreshToken);
    authSession.expiresAt = refreshTokenExpiresAt;
    authSession.lastUsedAt = new Date();
    await authSession.save(session ? { session } : undefined);

    const profile = toUserProfile(user);
    return {
      user: { ...profile, isAdmin: this.isAdminUser(user) },
      accessToken,
      refreshToken,
      accessTokenExpiresAt: accessTokenExpiresAt.toISOString(),
      refreshTokenExpiresAt: refreshTokenExpiresAt.toISOString()
    };
  }

  private ensureAgeGate(dateOfBirthIso: string): void {
    const dateOfBirth = new Date(dateOfBirthIso);
    if (Number.isNaN(dateOfBirth.getTime())) {
      throw new BadRequestException('dateOfBirth must be a valid ISO date');
    }

    const ageInYears = (Date.now() - dateOfBirth.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
    if (ageInYears < 12) {
      throw new BadRequestException('Users must be at least 12 years old');
    }
  }

  private calculateAccessExpiration(): Date {
    const minutes = this.configService.getOrThrow<number>('JWT_ACCESS_TTL_MINUTES');
    return new Date(Date.now() + minutes * 60 * 1000);
  }

  private calculateRefreshExpiration(): Date {
    const days = this.configService.getOrThrow<number>('JWT_REFRESH_TTL_DAYS');
    return new Date(Date.now() + days * 24 * 60 * 60 * 1000);
  }
}
