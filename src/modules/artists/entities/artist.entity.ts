import { IsBoolean, IsString } from 'class-validator';

export class Artist {
  id: string;
  @IsString()
  name: string;

  @IsBoolean()
  grammy: boolean;
}
