import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { MemoryDatabase } from 'src/services/db.service';

@Injectable()
export class FavoritesService {
  findAll() {
    return MemoryDatabase.favorites;
  }

  createTrack(id: string) {
    const currTrack = MemoryDatabase.tracks.find((i) => i.id === id);
    const currTrackFavs = MemoryDatabase.favorites.tracks.find(
      (track) => track.id === id,
    );
    if (!currTrack || currTrackFavs) {
      throw new UnprocessableEntityException();
    }
    MemoryDatabase.favorites.tracks.push(currTrack);
  }

  removeTrack(id: string) {
    const currTrack = MemoryDatabase.favorites.tracks.find(
      (track) => track.id === id,
    );
    if (!currTrack) {
      throw new NotFoundException();
    }
    const upd = MemoryDatabase.favorites.tracks.filter(
      (track) => track.id !== id,
    );
    MemoryDatabase.favorites.tracks = upd;
  }

  createArtist(id: string) {
    const currArtist = MemoryDatabase.artists.find(
      (artist) => artist.id === id,
    );
    if (!currArtist) {
      throw new UnprocessableEntityException();
    }
    MemoryDatabase.favorites.artists.push(currArtist);
  }

  removeArtist(id: string) {
    const currArtist = MemoryDatabase.favorites.artists.find(
      (artist) => artist.id === id,
    );
    if (!currArtist) {
      throw new NotFoundException();
    }
    MemoryDatabase.favorites.artists = MemoryDatabase.favorites.artists.filter(
      (artist) => artist.id !== id,
    );
  }

  createAlbum(id: string) {
    const currAlbum = MemoryDatabase.albums.find((artist) => artist.id === id);
    if (!currAlbum) {
      throw new UnprocessableEntityException();
    }
    MemoryDatabase.favorites.albums.push(currAlbum);
  }

  removeAlbum(id: string) {
    const currAlbum = MemoryDatabase.favorites.albums.find(
      (album) => album.id === id,
    );
    if (!currAlbum) {
      throw new NotFoundException();
    }
    MemoryDatabase.favorites.albums = MemoryDatabase.favorites.albums.filter(
      (album) => album.id !== id,
    );
  }
}
