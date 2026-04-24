import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import type { AccessTokenClaims } from '../../modules/auth/auth.types';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(ctx: ExecutionContext): boolean {
    const req = ctx.switchToHttp().getRequest<{ user?: AccessTokenClaims }>();
    if (!req.user?.isAdmin) {
      throw new ForbiddenException('Admin only');
    }
    return true;
  }
}
