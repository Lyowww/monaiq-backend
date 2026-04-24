import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import type { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import type { RefreshTokenClaims, RefreshTokenClaimsWithRawToken } from '../auth.types';

type RefreshRequest = Request & {
  body?: {
    refreshToken?: string;
  };
};

function extractRefreshToken(request?: RefreshRequest): string | null {
  if (typeof request?.body?.refreshToken === 'string' && request.body.refreshToken.length > 0) {
    return request.body.refreshToken;
  }

  const header = request?.headers.authorization;
  if (typeof header === 'string' && header.startsWith('Bearer ')) {
    return header.slice('Bearer '.length).trim();
  }

  return null;
}

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([extractRefreshToken]),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
      passReqToCallback: true
    });
  }

  validate(request: RefreshRequest, payload: RefreshTokenClaims): RefreshTokenClaimsWithRawToken {
    const refreshToken = extractRefreshToken(request);

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token is required');
    }

    return {
      ...payload,
      refreshToken
    };
  }
}
