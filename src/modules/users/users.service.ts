import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DBService } from '../db/db.service';

@Injectable()
export class UsersService {
  constructor(private dbService: DBService) {}

  async getAll() {
    return await this.dbService.getAllUsers();
  }

  async getById(id: string, withPassword?: boolean) {
    return await this.dbService.getUser(id, withPassword);
  }

  async create(userDto: CreateUserDto) {
    return await this.dbService.createUser(userDto);
  }

  async remove(id: string) {
    return await this.dbService.removeUser(id);
  }

  async update(updateUserDto: UpdateUserDto, id: string) {
    return await this.dbService.updateUser(updateUserDto, id);
  }

  async getPass(id: string) {
    return await this.dbService.getUserPass(id);
  }
}
