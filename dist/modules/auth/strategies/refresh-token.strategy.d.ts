import { ConfigService } from '@nestjs/config';
import type { Request } from 'express';
import { Strategy } from 'passport-jwt';
import type { RefreshTokenClaims, RefreshTokenClaimsWithRawToken } from '../auth.types';
type RefreshRequest = Request & {
    body?: {
        refreshToken?: string;
    };
};
declare const RefreshTokenStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class RefreshTokenStrategy extends RefreshTokenStrategy_base {
    constructor(configService: ConfigService);
    validate(request: RefreshRequest, payload: RefreshTokenClaims): RefreshTokenClaimsWithRawToken;
}
export {};
