import { IsInt, IsString, IsUUID } from 'class-validator';

export class Album {
  id: string;
  @IsString()
  name: string;

  @IsInt()
  year: number;

  @IsUUID(4)
  artistId: string | null;
}
