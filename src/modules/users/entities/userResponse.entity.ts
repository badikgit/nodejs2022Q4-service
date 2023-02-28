import { IsInt, IsString, IsUUID } from 'class-validator';

export class UserResponse {
  @IsUUID(4)
  id: string;

  @IsString()
  login: string;

  @IsInt()
  version: number;

  @IsInt()
  createdAt: number;

  @IsInt()
  updatedAt: number;
}
