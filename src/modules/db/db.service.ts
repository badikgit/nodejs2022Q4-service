import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { CreateAlbumDto } from '../albums/dto/create-album.dto';
import { UpdateAlbumDto } from '../albums/dto/update-album.dto';
import { Album } from '../albums/entities/album.entity';
import { CreateArtistDto } from '../artists/dto/create-artist.dto';
import { UpdateArtistDto } from '../artists/dto/update-artist.dto';
import { Artist } from '../artists/entities/artist.entity';
import { Favorite } from '../favorites/entities/favorite.entity';
import { CreateTrackDto } from '../tracks/dto/create-track.dto';
import { UpdateTrackDto } from '../tracks/dto/update-track.dto';
import { Track } from '../tracks/entities/track.entity';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UpdateUserDto } from '../users/dto/update-user.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class DBService {
  private readonly artists: Artist[] = [];
  private readonly albums: Album[] = [];
  private readonly tracks: Track[] = [];
  private readonly favorites: Favorite = {
    albums: [],
    artists: [],
    tracks: [],
  };
  private readonly users: User[] = [];

  // Artists
  async createArtist(createArtistDto: CreateArtistDto) {
    const newArtist = {
      id: uuid(),
      name: createArtistDto.name,
      grammy: createArtistDto.grammy,
    };
    this.artists.push(newArtist);
    return newArtist;
  }

  async getAllArtists() {
    return this.artists;
  }

  async getArtist(id: string) {
    const currArtist = this.artists.find((artist) => artist.id === id);
    if (!currArtist) {
      throw new NotFoundException('Artist not found');
    }
    return currArtist;
  }

  async updateArtist(id: string, updateArtistDto: UpdateArtistDto) {
    const currArtist = await this.getArtist(id);
    if (!currArtist) return;
    const elemIndex = this.artists.findIndex((artist) => artist.id === id);

    this.artists[elemIndex] = {
      ...this.artists[elemIndex],
      ...updateArtistDto,
    };

    return this.artists[elemIndex];
  }

  async removeArtist(id: string) {
    const currArtist = await this.getArtist(id);
    if (!currArtist) return;
    const artistIndex = this.artists.findIndex((artist) => artist.id === id);
    this.artists.splice(artistIndex, 1);
    this.favorites.artists.forEach((artist) => {
      if (artist.id === id) {
        artist.id = null;
      }
    });

    this.tracks.forEach((track) => {
      if (track.artistId === id) {
        track.artistId = null;
      }
    });
    this.favorites.tracks.forEach((track) => {
      if (track.artistId === id) {
        track.artistId = null;
      }
    });
    this.albums.forEach((album) => {
      if (album.artistId === id) {
        album.artistId = null;
      }
    });
    this.favorites.albums.forEach((album) => {
      if (album.artistId === id) {
        album.artistId = null;
      }
    });
  }

  // Albums
  async createAlbum(createAlbumDto: CreateAlbumDto) {
    const newAlbum = {
      id: uuid(),
      name: createAlbumDto.name,
      year: createAlbumDto.year,
      artistId: createAlbumDto.artistId,
    };
    this.albums.push(newAlbum);
    return newAlbum;
  }

  async getAllAlbums() {
    return this.albums;
  }

  async getAlbum(id: string) {
    const currAlbum = this.albums.find((album) => album.id === id);
    if (!currAlbum) {
      throw new NotFoundException('Album not found');
    }
    return currAlbum;
  }

  async updateAlbum(id: string, updateAlbumDto: UpdateAlbumDto) {
    const currAlbum = await this.getAlbum(id);
    if (!currAlbum) return;
    const elemIndex = this.albums.findIndex((album) => album.id === id);

    this.albums[elemIndex] = {
      ...this.albums[elemIndex],
      ...updateAlbumDto,
    };

    return this.albums[elemIndex];
  }

  async removeAlbum(id: string) {
    const currAlbum = await this.getAlbum(id);
    if (!currAlbum) return;
    const albumIndex = this.albums.findIndex((album) => album.id === id);
    this.albums.splice(albumIndex, 1);
    this.favorites.albums = this.favorites.albums.filter(
      (album) => album.id !== id,
    );
    this.tracks.forEach((track) => {
      if (track.albumId === id) {
        track.albumId = null;
      }
    });
    this.favorites.tracks.forEach((track) => {
      if (track.albumId === id) {
        track.albumId = null;
      }
    });
  }

  // Favorites
  async getFavorites() {
    return this.favorites;
  }

  async createFavoriteTrack(id: string) {
    const currTrack = this.tracks.find((i) => i.id === id);
    const currTrackFavs = this.favorites.tracks.find(
      (track) => track.id === id,
    );
    if (!currTrack || currTrackFavs) {
      throw new UnprocessableEntityException();
    }
    this.favorites.tracks.push(currTrack);
  }

  async removeFavoriteTrack(id: string) {
    const currTrack = this.favorites.tracks.find((track) => track.id === id);
    if (!currTrack) {
      throw new NotFoundException();
    }
    const upd = this.favorites.tracks.filter((track) => track.id !== id);
    this.favorites.tracks = upd;
  }

  async createFavoriteArtist(id: string) {
    const currArtist = this.artists.find((artist) => artist.id === id);
    if (!currArtist) {
      throw new UnprocessableEntityException();
    }
    this.favorites.artists.push(currArtist);
  }

  async removeFavoriteArtist(id: string) {
    const currArtist = this.favorites.artists.find(
      (artist) => artist.id === id,
    );
    if (!currArtist) {
      throw new NotFoundException();
    }
    this.favorites.artists = this.favorites.artists.filter(
      (artist) => artist.id !== id,
    );
  }

  async createFavoriteAlbum(id: string) {
    const currAlbum = this.albums.find((artist) => artist.id === id);
    if (!currAlbum) {
      throw new UnprocessableEntityException();
    }
    this.favorites.albums.push(currAlbum);
  }

  async removeFavoriteAlbum(id: string) {
    const currAlbum = this.favorites.albums.find((album) => album.id === id);
    if (!currAlbum) {
      throw new NotFoundException();
    }
    this.favorites.albums = this.favorites.albums.filter(
      (album) => album.id !== id,
    );
  }

  // Tracks
  async createTrack(createTrackDto: CreateTrackDto) {
    const newTrack = {
      id: uuid(),
      name: createTrackDto.name,
      albumId: createTrackDto.albumId,
      artistId: createTrackDto.artistId,
      duration: createTrackDto.duration,
    };
    this.tracks.push(newTrack);
    return newTrack;
  }

  async getAllTracks() {
    return this.tracks;
  }

  async getTrack(id: string) {
    const currTrack = this.tracks.find((track) => track.id === id);
    if (!currTrack) {
      throw new NotFoundException('Track not found');
    }
    return currTrack;
  }

  async updateTrack(id: string, updateTrackDto: UpdateTrackDto) {
    const currTrack = await this.getTrack(id);
    if (!currTrack) return;
    const elemIndex = this.tracks.findIndex((track) => track.id === id);
    this.tracks[elemIndex] = {
      ...this.tracks[elemIndex],
      ...updateTrackDto,
    };
    return this.tracks[elemIndex];
  }

  async removeTrack(id: string) {
    const currTrack = await this.getTrack(id);
    if (!currTrack) return;
    const trackIndex = this.tracks.findIndex((track) => track.id === id);
    this.tracks.splice(trackIndex, 1);
    this.favorites.tracks = this.favorites.tracks.filter(
      (track) => track.id !== id,
    );
  }

  // Users
  async getAllUsers() {
    return this.users.map((user) => {
      delete user.password;
      return user;
    });
  }

  async getUser(id: string, withPassword?: boolean) {
    const currUser = this.users.find((user) => user.id === id);
    if (!currUser) {
      throw new NotFoundException('User not found');
    }
    const res = { ...currUser, id };
    if (!withPassword) {
      delete res.password;
    }
    return res;
  }

  async createUser(userDto: CreateUserDto) {
    const newUser = {
      id: uuid(),
      login: userDto.login,
      version: 1,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    this.users.push({ ...newUser, password: userDto.password });
    return newUser;
  }

  async removeUser(id: string) {
    const currUser = await this.getUser(id);
    if (!currUser) return;
    const userIndex = this.users.findIndex((user) => user.id === id);
    this.users.splice(userIndex, 1);
  }

  async updateUser(updateUserDto: UpdateUserDto, id: string) {
    const currUser = await this.getUser(id, true);
    if (!currUser) return;
    const elemIndex = this.users.findIndex((user) => user.id === id);

    this.users[elemIndex] = {
      ...this.users[elemIndex],
      version: this.users[elemIndex].version + 1,
      password: updateUserDto.newPassword,
      updatedAt: Date.now(),
    };

    const res = { ...this.users[elemIndex] };
    delete res.password;
    return res;
  }

  async getUserPass(id: string) {
    const currUser = await this.getUser(id, true);
    return {
      password: currUser.password,
    };
  }
}
