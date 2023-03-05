import { IsNotEmpty, IsString } from 'class-validator';

export class ValidateUserDto {
  @IsString()
  @IsNotEmpty()
  login: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
