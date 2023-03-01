import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  NotFoundException,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  ValidationPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto } from './dto';
import { UserResponse } from './entities';
import { comparePassword, encodePassword } from 'src/utils/bcrypt';

@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getAll(): Promise<UserResponse[]> {
    const users: UserResponse[] = (await this.usersService.getAll()).map(
      (user) => ({
        id: user.id,
        login: user.login,
        version: user.version,
        createdAt: user.createdAt.getTime(),
        updatedAt: user.updatedAt.getTime(),
      }),
    );
    return users;
  }

  @Get(':id')
  async getOne(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<UserResponse> {
    const user = await this.usersService.getById(id);
    if (!user) {
      throw new NotFoundException('User with specified id not found');
    }
    return {
      id,
      login: user.login,
      version: user.version,
      createdAt: user.createdAt.getTime(),
      updatedAt: user.updatedAt.getTime(),
    };
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body(ValidationPipe) createUserDto: CreateUserDto,
  ): Promise<UserResponse> {
    const password = encodePassword(createUserDto.password);
    const newUser = await this.usersService.create({
      ...createUserDto,
      password,
    });
    return {
      id: newUser.id,
      login: newUser.login,
      version: newUser.version,
      createdAt: newUser.createdAt.getTime(),
      updatedAt: newUser.updatedAt.getTime(),
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<UserResponse> {
    const user = await this.usersService.getById(id);
    if (!user) {
      throw new NotFoundException('User with specified id not found');
    }
    const removedUser = await this.usersService.remove(id);
    if (!removedUser) {
      throw new NotFoundException('User with specified id not found');
    }

    return {
      id,
      login: removedUser.login,
      version: removedUser.version,
      createdAt: removedUser.createdAt.getTime(),
      updatedAt: removedUser.updatedAt.getTime(),
    };
  }

  @Put(':id')
  async update(
    @Body(ValidationPipe) updateUserDto: UpdateUserDto,
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<UserResponse> {
    const user = await this.usersService.getById(id);
    if (!user) {
      throw new NotFoundException('User with specified id not found');
    }

    if (updateUserDto.oldPassword === updateUserDto.newPassword) {
      throw new ForbiddenException('Password matches the old one');
    } else if (
      comparePassword(
        updateUserDto.oldPassword,
        await this.usersService.getPass(id),
      )
    ) {
      throw new ForbiddenException('Old password do not match');
    }
    const newPassword = encodePassword(updateUserDto.newPassword);
    const updatedUser = await this.usersService.update(user.id, {
      ...updateUserDto,
      newPassword,
    });

    return {
      id,
      login: updatedUser.login,
      version: updatedUser.version,
      createdAt: updatedUser.createdAt.getTime(),
      updatedAt: updatedUser.updatedAt.getTime(),
    };
  }
}
