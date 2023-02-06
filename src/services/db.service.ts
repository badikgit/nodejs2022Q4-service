import { Artist } from 'src/modules/artists/entities/artist.entity';

export class MemoryDatabase {
  static artists: Artist[] = [];
}
