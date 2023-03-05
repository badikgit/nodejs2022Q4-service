import {
  Injectable,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { comparePassword, encodePassword } from 'src/utils/bcrypt';
import { LoginUserDto, SipnUpUserDto, ValidateUserDto } from './dto';
import { UsersService } from '../users/users.service';
import { UserResponse } from '../users/entities';
import { jwtConstants } from './constants';
import { TokenResponse } from './entities';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(sipnUpUserDto: SipnUpUserDto): Promise<TokenResponse> {
    const user = await this.userService.getByLogin(sipnUpUserDto.login);
    if (user) {
      throw new ConflictException(
        'User with specified login is already exists.',
      );
    }

    const password = encodePassword(sipnUpUserDto.password);
    const newUser = await this.userService.create({
      ...sipnUpUserDto,
      password,
    });

    const tokens = await this.getTokens(newUser.id, newUser.login);
    await this.updateUserRefreshToken(newUser.id, tokens.refreshToken);

    return tokens;
  }

  async getTokens(userId: string, login: string) {
    const payload = { sub: userId, login: login };

    return {
      accessToken: this.jwtService.sign(payload, {
        secret: jwtConstants.jwtSecretKey,
        expiresIn: jwtConstants.tokenExpireTime,
      }),
      refreshToken: this.jwtService.sign(payload, {
        secret: jwtConstants.jwtSecretRefreshKey,
        expiresIn: jwtConstants.tokenRefreshExpireTime,
      }),
    };
  }

  async validateUser(validateUserDto: ValidateUserDto): Promise<UserResponse> {
    const user = await this.userService.getByLogin(validateUserDto.login);
    if (!user) {
      throw new ForbiddenException('Wrong login or email');
    }
    const isValidePassword = comparePassword(
      validateUserDto.password,
      user.password,
    );
    if (!isValidePassword) {
      throw new ForbiddenException('Wrong login or email');
    }
    return {
      id: user.id,
      login: user.login,
      refreshToken: user.refreshToken,
      version: user.version,
      createdAt: user.createdAt.getTime(),
      updatedAt: user.updatedAt.getTime(),
    };
  }

  async updateUserRefreshToken(id: string, refreshToken: string) {
    const refreshTokenHash = encodePassword(refreshToken);
    await this.userService.updateToken(id, refreshTokenHash);
  }

  async login(loginUserDto: LoginUserDto) {
    const user = await this.validateUser(loginUserDto);
    const tokens = await this.getTokens(user.id, user.login);
    await this.updateUserRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }

  async refreshAuthTokens(refreshToken: string) {
    const { sub: userId } = await this.jwtService.verifyAsync(refreshToken, {
      secret: jwtConstants.jwtSecretRefreshKey,
    });

    if (!userId) {
      throw new ForbiddenException('Invalid token');
    }

    const user = await this.userService.getById(userId);
    if (!user) {
      throw new ForbiddenException('Invalid token');
    }

    const refreshTokenMatch = comparePassword(refreshToken, user.refreshToken);

    if (!refreshTokenMatch) {
      throw new ForbiddenException('Invalid or expired token');
    }

    const tokens = await this.getTokens(user.id, user.login);
    await this.updateUserRefreshToken(user.id, tokens.refreshToken);

    return tokens;
  }
}
