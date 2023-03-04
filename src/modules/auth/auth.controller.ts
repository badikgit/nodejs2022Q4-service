import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  ValidationPipe,
  UnauthorizedException,
  Request,
} from '@nestjs/common';

import { Request as RequestType } from 'express';

import { AuthService } from './auth.service';
import { LoginUserDto, RefreshTokenDTO, SipnUpUserDto } from './dto';
import { TokenResponse } from './entities';
import { Public } from './guards';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  async signUp(
    @Body(ValidationPipe)
    sipnUpUserDto: SipnUpUserDto,
  ): Promise<TokenResponse> {
    return await this.authService.signUp(sipnUpUserDto);
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Request() req: RequestType,
    @Body(ValidationPipe)
    loginUserDto: LoginUserDto,
  ): Promise<TokenResponse> {
    return await this.authService.login(loginUserDto);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refreshAuthTokens(@Body() refreshTokenDTO: RefreshTokenDTO) {
    if (!refreshTokenDTO.refreshToken) {
      throw new UnauthorizedException('Invalid authetication data');
    }
    return this.authService.refreshAuthTokens(refreshTokenDTO.refreshToken);
  }
}
