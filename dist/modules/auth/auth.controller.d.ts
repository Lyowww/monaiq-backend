import type { Request } from 'express';
import { AuthService } from './auth.service';
import { LoginDto, RefreshTokenDto, RegisterDto } from './auth.dto';
import type { AccessTokenClaims, RefreshTokenClaims, RefreshTokenClaimsWithRawToken } from './auth.types';
type TypedRequest = Request & {
    ip?: string;
    headers: Request['headers'];
};
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(dto: RegisterDto, request: TypedRequest): Promise<import("@ai-finance/shared-types").AuthSessionResponse>;
    login(dto: LoginDto, request: TypedRequest): Promise<import("@ai-finance/shared-types").AuthSessionResponse>;
    refresh(_dto: RefreshTokenDto, claims: RefreshTokenClaimsWithRawToken, request: TypedRequest): Promise<import("@ai-finance/shared-types").AuthSessionResponse>;
    logout(_dto: RefreshTokenDto, claims: RefreshTokenClaims, request: TypedRequest): Promise<{
        success: true;
    }>;
    me(claims: AccessTokenClaims): Promise<import("@ai-finance/shared-types").UserProfile>;
    private getMeta;
}
export {};
