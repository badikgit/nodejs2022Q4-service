import { IsArray } from 'class-validator';
import { Track } from 'src/modules/tracks/entities/track.entity';
import { Album } from 'src/modules/albums/entities/album.entity';
import { Artist } from 'src/modules/artists/entities/artist.entity';

export class Favorite {
  @IsArray()
  artists: Artist[];

  @IsArray()
  albums: Album[];

  @IsArray()
  tracks: Track[];
}
