import { ConfigService } from '@nestjs/config';
import { Strategy } from 'passport-jwt';
import type { AccessTokenClaims } from '../auth.types';
declare const AccessTokenStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class AccessTokenStrategy extends AccessTokenStrategy_base {
    constructor(configService: ConfigService);
    validate(payload: AccessTokenClaims & {
        isAdmin?: boolean;
    }): AccessTokenClaims;
}
export {};
