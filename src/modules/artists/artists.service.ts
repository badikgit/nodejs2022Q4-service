import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { MemoryDatabase } from 'src/services/db.service';
import { v4 as uuid } from 'uuid';

@Injectable()
export class ArtistsService {
  create(createArtistDto: CreateArtistDto) {
    const newArtist = {
      id: uuid(),
      name: createArtistDto.name,
      grammy: createArtistDto.grammy,
    };
    MemoryDatabase.artists.push(newArtist);
    return newArtist;
  }

  findAll() {
    return MemoryDatabase.artists;
  }

  findOne(id: string) {
    const currArtist = MemoryDatabase.artists.find(
      (artist) => artist.id === id,
    );
    if (!currArtist) {
      throw new NotFoundException('Artist not found');
    }
    return currArtist;
  }

  update(id: string, updateArtistDto: UpdateArtistDto) {
    const currArtist = this.findOne(id);
    if (!currArtist) return;
    const elemIndex = MemoryDatabase.artists.findIndex(
      (artist) => artist.id === id,
    );

    MemoryDatabase.artists[elemIndex] = {
      ...MemoryDatabase.artists[elemIndex],
      ...updateArtistDto,
    };

    return MemoryDatabase.artists[elemIndex];
  }

  remove(id: string) {
    const currArtist = this.findOne(id);
    if (!currArtist) return;
    MemoryDatabase.artists = MemoryDatabase.artists.filter(
      (artist) => artist.id !== id,
    );
    MemoryDatabase.tracks.forEach((track) => {
      if (track.artistId === id) {
        track.artistId = null;
      }
    });
    MemoryDatabase.favorites.tracks.forEach((track) => {
      if (track.artistId === id) {
        track.artistId = null;
      }
    });
    MemoryDatabase.albums.forEach((album) => {
      if (album.artistId === id) {
        album.artistId = null;
      }
    });
    MemoryDatabase.favorites.albums.forEach((album) => {
      if (album.artistId === id) {
        album.artistId = null;
      }
    });
  }
}
