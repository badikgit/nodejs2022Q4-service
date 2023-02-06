import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { v4 } from 'uuid';
import { MemoryDatabase } from 'src/services/db.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  getAll() {
    return MemoryDatabase.users.map((user) => {
      delete user.password;
      return user;
    });
  }

  getById(id: string, withPassword: boolean) {
    const currUser = MemoryDatabase.users.find((user) => user.id === id);
    if (!currUser) {
      throw new NotFoundException('User not found');
    }
    const res = { ...currUser, id };
    if (!withPassword) {
      delete res.password;
    }
    return res;
  }

  create(userDto: CreateUserDto) {
    const newUser = {
      id: v4(),
      login: userDto.login,
      version: 1,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    MemoryDatabase.users.push({ ...newUser, password: userDto.password });
    return newUser;
  }

  remove(id: string) {
    const currUser = this.getById(id, false);
    if (!currUser) return;
    MemoryDatabase.users = MemoryDatabase.users.filter(
      (user) => user.id !== id,
    );
  }

  update(updateUserDto: UpdateUserDto, id: string) {
    const currUser = this.getById(id, true);
    if (!currUser) return;
    const elemIndex = MemoryDatabase.users.findIndex((user) => user.id === id);

    MemoryDatabase.users[elemIndex] = {
      ...MemoryDatabase.users[elemIndex],
      version: MemoryDatabase.users[elemIndex].version + 1,
      password: updateUserDto.newPassword,
      updatedAt: Date.now(),
    };

    const res = { ...MemoryDatabase.users[elemIndex] };
    delete res.password;
    return res;
  }

  getPass(id: string) {
    const currUser = this.getById(id, true);
    return {
      password: currUser.password,
    };
  }
}
