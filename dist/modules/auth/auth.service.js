"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const mongoose_1 = require("@nestjs/mongoose");
const argon2 = __importStar(require("argon2"));
const crypto_1 = require("crypto");
const jwt_1 = require("@nestjs/jwt");
const mongoose_2 = require("mongoose");
const users_service_1 = require("../users/users.service");
const user_schema_1 = require("../users/schemas/user.schema");
const auth_session_schema_1 = require("./schemas/auth-session.schema");
let AuthService = class AuthService {
    configService;
    jwtService;
    usersService;
    authSessionModel;
    connection;
    constructor(configService, jwtService, usersService, authSessionModel, connection) {
        this.configService = configService;
        this.jwtService = jwtService;
        this.usersService = usersService;
        this.authSessionModel = authSessionModel;
        this.connection = connection;
    }
    async register(dto, meta) {
        this.ensureAgeGate(dto.dateOfBirth);
        const existingUser = await this.usersService.findByEmail(dto.email);
        if (existingUser) {
            throw new common_1.ConflictException('Email is already registered');
        }
        const passwordHash = await argon2.hash(dto.password);
        const mongoSession = await this.connection.startSession();
        try {
            mongoSession.startTransaction();
            const user = await this.usersService.create({
                email: dto.email.toLowerCase(),
                passwordHash,
                firstName: dto.firstName.trim(),
                lastName: dto.lastName.trim(),
                dateOfBirth: new Date(dto.dateOfBirth)
            }, mongoSession);
            const authSession = await this.createAuthSession(user._id, meta, mongoSession);
            const authResponse = await this.issueTokens(user, authSession, mongoSession);
            await mongoSession.commitTransaction();
            return authResponse;
        }
        catch (error) {
            await mongoSession.abortTransaction();
            throw error;
        }
        finally {
            await mongoSession.endSession();
        }
    }
    async login(dto, meta) {
        const envEmailRaw = this.configService.get('ADMIN_LOGIN_EMAIL');
        const envPassword = this.configService.get('ADMIN_LOGIN_PASSWORD');
        const envEmail = typeof envEmailRaw === 'string' && envEmailRaw.trim().length > 0
            ? envEmailRaw.trim().toLowerCase()
            : null;
        if (envEmail && envPassword && envPassword.length > 0) {
            const triedEmail = dto.email.trim().toLowerCase();
            if (triedEmail === envEmail) {
                if (!this.securePasswordMatch(dto.password, envPassword)) {
                    throw new common_1.UnauthorizedException('Invalid email or password');
                }
                const user = await this.ensureEnvAdminUser(envEmail);
                const authSession = await this.createAuthSession(user._id, meta);
                return this.issueTokens(user, authSession);
            }
        }
        const user = await this.usersService.findByEmail(dto.email);
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid email or password');
        }
        const passwordMatches = await argon2.verify(user.passwordHash, dto.password);
        if (!passwordMatches) {
            throw new common_1.UnauthorizedException('Invalid email or password');
        }
        const authSession = await this.createAuthSession(user._id, meta);
        return this.issueTokens(user, authSession);
    }
    async refreshSession(claims, meta) {
        const authSession = await this.authSessionModel.findById(claims.sessionId).exec();
        if (!authSession || authSession.userId.toString() !== claims.sub || authSession.revokedAt) {
            throw new common_1.UnauthorizedException('Refresh session is not valid');
        }
        if (authSession.expiresAt.getTime() <= Date.now()) {
            throw new common_1.UnauthorizedException('Refresh token has expired');
        }
        const isCurrentToken = await argon2.verify(authSession.refreshTokenHash, claims.refreshToken);
        if (!isCurrentToken) {
            await this.authSessionModel
                .updateMany({
                userId: new mongoose_2.Types.ObjectId(claims.sub),
                familyId: claims.familyId,
                revokedAt: null
            }, {
                $set: {
                    revokedAt: new Date()
                }
            })
                .exec();
            throw new common_1.UnauthorizedException('Refresh token reuse detected');
        }
        const user = await this.usersService.findById(claims.sub);
        if (!user) {
            throw new common_1.UnauthorizedException('User was not found');
        }
        authSession.deviceName = meta.deviceName;
        authSession.userAgent = meta.userAgent;
        authSession.ipAddress = meta.ipAddress;
        return this.issueTokens(user, authSession);
    }
    async logout(claims) {
        await this.authSessionModel
            .findByIdAndUpdate(claims.sessionId, {
            revokedAt: new Date()
        })
            .exec();
        return { success: true };
    }
    async me(claims) {
        const user = await this.usersService.findById(claims.sub);
        if (!user) {
            throw new common_1.UnauthorizedException('User session is invalid');
        }
        return (0, user_schema_1.toUserProfile)(user);
    }
    async createAuthSession(userId, meta, session) {
        const refreshTokenHash = await argon2.hash((0, crypto_1.randomUUID)());
        const createdSessions = await this.authSessionModel.create([
            {
                userId,
                familyId: (0, crypto_1.randomUUID)(),
                deviceName: meta.deviceName,
                userAgent: meta.userAgent,
                ipAddress: meta.ipAddress,
                refreshTokenHash,
                expiresAt: this.calculateRefreshExpiration()
            }
        ], session ? { session } : undefined);
        const authSession = createdSessions[0];
        if (!authSession) {
            throw new common_1.UnauthorizedException('Failed to create auth session');
        }
        return authSession;
    }
    securePasswordMatch(plain, expected) {
        const a = Buffer.from(plain, 'utf8');
        const b = Buffer.from(expected, 'utf8');
        if (a.length !== b.length) {
            return false;
        }
        return (0, crypto_1.timingSafeEqual)(a, b);
    }
    /** Ensures a DB user exists for env-based admin login (refresh tokens need a real user id). */
    async ensureEnvAdminUser(email) {
        let user = await this.usersService.findByEmail(email);
        if (user) {
            if (!user.isAdmin) {
                user.isAdmin = true;
                await user.save();
            }
            return user;
        }
        const passwordHash = await argon2.hash((0, crypto_1.randomUUID)());
        return this.usersService.create({
            email,
            passwordHash,
            firstName: 'MonAIQ',
            lastName: 'Admin',
            dateOfBirth: new Date('1990-01-01T00:00:00.000Z'),
            isAdmin: true
        });
    }
    isAdminUser(user) {
        if (user.isAdmin) {
            return true;
        }
        const raw = this.configService.get('ADMIN_EMAILS') ?? '';
        const list = raw
            .split(',')
            .map((s) => s.trim().toLowerCase())
            .filter((s) => s.length > 0);
        return list.includes(user.email.toLowerCase());
    }
    async issueTokens(user, authSession, session) {
        const accessTokenExpiresAt = this.calculateAccessExpiration();
        const refreshTokenExpiresAt = this.calculateRefreshExpiration();
        const accessPayload = {
            sub: user._id.toString(),
            email: user.email,
            sessionId: authSession._id.toString(),
            type: 'access',
            isAdmin: this.isAdminUser(user)
        };
        const refreshPayload = {
            sub: user._id.toString(),
            email: user.email,
            sessionId: authSession._id.toString(),
            familyId: authSession.familyId,
            type: 'refresh'
        };
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(accessPayload, {
                secret: this.configService.getOrThrow('JWT_ACCESS_SECRET'),
                expiresIn: `${this.configService.getOrThrow('JWT_ACCESS_TTL_MINUTES')}m`
            }),
            this.jwtService.signAsync(refreshPayload, {
                secret: this.configService.getOrThrow('JWT_REFRESH_SECRET'),
                expiresIn: `${this.configService.getOrThrow('JWT_REFRESH_TTL_DAYS')}d`
            })
        ]);
        authSession.refreshTokenHash = await argon2.hash(refreshToken);
        authSession.expiresAt = refreshTokenExpiresAt;
        authSession.lastUsedAt = new Date();
        await authSession.save(session ? { session } : undefined);
        const profile = (0, user_schema_1.toUserProfile)(user);
        return {
            user: { ...profile, isAdmin: this.isAdminUser(user) },
            accessToken,
            refreshToken,
            accessTokenExpiresAt: accessTokenExpiresAt.toISOString(),
            refreshTokenExpiresAt: refreshTokenExpiresAt.toISOString()
        };
    }
    ensureAgeGate(dateOfBirthIso) {
        const dateOfBirth = new Date(dateOfBirthIso);
        if (Number.isNaN(dateOfBirth.getTime())) {
            throw new common_1.BadRequestException('dateOfBirth must be a valid ISO date');
        }
        const ageInYears = (Date.now() - dateOfBirth.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
        if (ageInYears < 12) {
            throw new common_1.BadRequestException('Users must be at least 12 years old');
        }
    }
    calculateAccessExpiration() {
        const minutes = this.configService.getOrThrow('JWT_ACCESS_TTL_MINUTES');
        return new Date(Date.now() + minutes * 60 * 1000);
    }
    calculateRefreshExpiration() {
        const days = this.configService.getOrThrow('JWT_REFRESH_TTL_DAYS');
        return new Date(Date.now() + days * 24 * 60 * 60 * 1000);
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(3, (0, mongoose_1.InjectModel)(auth_session_schema_1.AuthSession.name)),
    __param(4, (0, mongoose_1.InjectConnection)()),
    __metadata("design:paramtypes", [config_1.ConfigService,
        jwt_1.JwtService,
        users_service_1.UsersService,
        mongoose_2.Model,
        mongoose_2.Connection])
], AuthService);
//# sourceMappingURL=auth.service.js.map