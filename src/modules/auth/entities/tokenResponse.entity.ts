import { IsJWT } from 'class-validator';

export class TokenResponse {
  @IsJWT()
  accessToken: string;

  @IsJWT()
  refreshToken: string;
}
