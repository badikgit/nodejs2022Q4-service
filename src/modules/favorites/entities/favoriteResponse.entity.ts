import { IsArray } from 'class-validator';
import { Album, Artist, Track } from '@prisma/client';

export class FavoriteResponse {
  @IsArray()
  albums: Album[];

  @IsArray()
  artists: Artist[];

  @IsArray()
  tracks: Track[];
}
