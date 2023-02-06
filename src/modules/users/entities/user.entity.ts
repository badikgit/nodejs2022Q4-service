import { Exclude } from 'class-transformer';
import { IsInt, IsString, IsUUID } from 'class-validator';

export class User {
  @IsUUID(4)
  id: string;

  @IsString()
  login: string;

  @IsString()
  @Exclude()
  password: string;

  @IsInt()
  version: number;

  @IsInt()
  createdAt: number;

  @IsInt()
  updatedAt: number;
}
