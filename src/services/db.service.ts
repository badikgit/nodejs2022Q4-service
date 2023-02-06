import { Artist } from 'src/modules/artists/entities/artist.entity';
import { Album } from 'src/modules/albums/entities/album.entity';
import { Track } from 'src/modules/tracks/entities/track.entity';
import { User } from 'src/modules/users/entities/user.entity';

type Favorites = {
  artists: Artist[];
  albums: Album[];
  tracks: Track[];
};

export class MemoryDatabase {
  static artists: Artist[] = [];
  static albums: Album[] = [];
  static tracks: Track[] = [];
  static favorites: Favorites = {
    artists: [],
    albums: [],
    tracks: [],
  };
  static users: User[] = [];
}
