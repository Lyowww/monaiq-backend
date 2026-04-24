import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import type { AccessTokenClaims } from '../auth.types';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt-access') {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>('JWT_ACCESS_SECRET')
    });
  }

  validate(
    payload: AccessTokenClaims & { isAdmin?: boolean }
  ): AccessTokenClaims {
    return {
      ...payload,
      isAdmin: payload.isAdmin === true
    };
  }
}
