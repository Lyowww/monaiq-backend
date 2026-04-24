export interface AccessTokenClaims {
    sub: string;
    email: string;
    sessionId: string;
    type: 'access';
    isAdmin: boolean;
}
export interface RefreshTokenClaims {
    sub: string;
    email: string;
    sessionId: string;
    familyId: string;
    type: 'refresh';
}
export interface RefreshTokenClaimsWithRawToken extends RefreshTokenClaims {
    refreshToken: string;
}
export interface RequestMeta {
    deviceName: string;
    ipAddress?: string;
    userAgent?: string;
}
