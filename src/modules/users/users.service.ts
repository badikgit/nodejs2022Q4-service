import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto, UpdateUserDto } from './dto';
import { User } from 'prisma/prisma-client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getAll(): Promise<User[]> {
    return await this.prisma.user.findMany();
  }

  async getById(id: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });
    return user;
  }

  async getByLogin(login: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: {
        login,
      },
    });
    return user;
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    return await this.prisma.user.create({
      data: {
        ...createUserDto,
        version: 1,
      },
    });
  }

  async remove(id: string): Promise<User> {
    return await this.prisma.user.delete({
      where: {
        id,
      },
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });

    return await this.prisma.user.update({
      where: {
        id,
      },
      data: {
        password: updateUserDto.newPassword,
        version: user.version + 1,
      },
    });
  }

  async updateToken(id: string, refreshToken: string): Promise<User> {
    const user = {
      ...(await this.prisma.user.findUnique({
        where: {
          id,
        },
      })),
      refreshToken,
    };

    const updatedUser = await this.prisma.user.update({
      where: {
        id,
      },
      data: {
        ...user,
      },
    });

    return updatedUser;
  }

  async getPass(id: string): Promise<string> {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });
    return user.password;
  }
}
