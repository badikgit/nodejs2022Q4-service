import { IsInt, IsOptional, IsString, IsUUID } from 'class-validator';

export class UpdateAlbumDto {
  @IsString()
  name: string;

  @IsInt()
  year: number;

  @IsUUID(4)
  @IsOptional()
  artistId: string | null;
}
