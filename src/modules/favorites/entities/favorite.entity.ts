import { IsArray } from 'class-validator';

export class Favorites {
  @IsArray()
  artists: string[];

  @IsArray()
  albums: string[];

  @IsArray()
  tracks: string[];
}
