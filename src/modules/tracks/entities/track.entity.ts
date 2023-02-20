import { IsInt, IsString, IsUUID } from 'class-validator';

export class Track {
  id: string;

  @IsString()
  name: string;

  @IsUUID(4)
  artistId: string | null;

  @IsUUID(4)
  albumId: string | null;

  @IsInt()
  duration: number;
}
