import { IsInt, IsString, IsUUID, IsOptional } from 'class-validator';

export class UserResponse {
  @IsUUID(4)
  id: string;

  @IsString()
  login: string;

  @IsString()
  @IsOptional()
  refreshToken: string;

  @IsInt()
  version: number;

  @IsInt()
  createdAt: number;

  @IsInt()
  updatedAt: number;
}
