import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags
} from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RefreshTokenGuard } from '../../common/guards/refresh-token.guard';
import {
  AuthSessionResponseDto,
  SuccessResponseDto,
  UserProfileDto
} from '../../common/swagger/swagger.models';
import { AuthService } from './auth.service';
import { LoginDto, RefreshTokenDto, RegisterDto } from './auth.dto';
import type {
  AccessTokenClaims,
  RefreshTokenClaims,
  RefreshTokenClaimsWithRawToken,
  RequestMeta
} from './auth.types';

type TypedRequest = Request & {
  ip?: string;
  headers: Request['headers'];
};

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user account' })
  @ApiCreatedResponse({ type: AuthSessionResponseDto })
  register(@Body() dto: RegisterDto, @Req() request: TypedRequest) {
    return this.authService.register(dto, this.getMeta(request, dto.deviceName));
  }

  @Post('login')
  @ApiOperation({ summary: 'Authenticate and start a rotated refresh session' })
  @ApiOkResponse({ type: AuthSessionResponseDto })
  login(@Body() dto: LoginDto, @Req() request: TypedRequest) {
    return this.authService.login(dto, this.getMeta(request, dto.deviceName));
  }

  @Post('refresh')
  @UseGuards(RefreshTokenGuard)
  @ApiOperation({ summary: 'Rotate the refresh token and issue new credentials' })
  @ApiBearerAuth('bearer')
  @ApiOkResponse({ type: AuthSessionResponseDto })
  refresh(
    @Body() _dto: RefreshTokenDto,
    @CurrentUser() claims: RefreshTokenClaimsWithRawToken,
    @Req() request: TypedRequest
  ) {
    return this.authService.refreshSession(claims, this.getMeta(request, 'Current Device'));
  }

  @Post('logout')
  @UseGuards(RefreshTokenGuard)
  @ApiOperation({ summary: 'Revoke the current refresh session' })
  @ApiBearerAuth('bearer')
  @ApiOkResponse({ type: SuccessResponseDto })
  logout(
    @Body() _dto: RefreshTokenDto,
    @CurrentUser() claims: RefreshTokenClaims,
    @Req() request: TypedRequest
  ) {
    void request;
    return this.authService.logout(claims);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Return the authenticated user profile' })
  @ApiBearerAuth('bearer')
  @ApiOkResponse({ type: UserProfileDto })
  me(@CurrentUser() claims: AccessTokenClaims) {
    return this.authService.me(claims);
  }

  private getMeta(request: TypedRequest, deviceName: string): RequestMeta {
    return {
      deviceName,
      ipAddress: request.ip,
      userAgent:
        typeof request.headers['user-agent'] === 'string'
          ? request.headers['user-agent']
          : undefined
    };
  }
}
