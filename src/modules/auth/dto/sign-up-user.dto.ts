import { IsNotEmpty, IsString } from 'class-validator';

export class SipnUpUserDto {
  @IsString()
  @IsNotEmpty()
  login: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
