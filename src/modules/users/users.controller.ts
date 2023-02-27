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
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto } from './dto';
import { UserResponse } from './entities';

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
  async create(@Body() createUserDto: CreateUserDto): Promise<UserResponse> {
    const newUser = await this.usersService.create(createUserDto);
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
    const removedUser = await this.usersService.remove(id);
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
    @Body() updateUserDto: UpdateUserDto,
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<UserResponse> {
    const user = await this.usersService.getById(id);
    if (!user) {
      throw new NotFoundException('User with specified id not found');
    }

    if (updateUserDto.oldPassword === updateUserDto.newPassword) {
      throw new ForbiddenException('Password matches the old one');
    } else if (
      (await this.usersService.getPass(id)) !== updateUserDto.oldPassword
    ) {
      throw new ForbiddenException('Old password do not match');
    }

    const updatedUser = await this.usersService.update(user.id, updateUserDto);

    return {
      id,
      login: updatedUser.login,
      version: updatedUser.version,
      createdAt: updatedUser.createdAt.getTime(),
      updatedAt: updatedUser.updatedAt.getTime(),
    };
  }
}
