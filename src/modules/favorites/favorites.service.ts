import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFavoriteDto } from './dto';
import { FavoriteResponse } from './entities';

@Injectable()
export class FavoritesService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<FavoriteResponse> {
    const allArtists = await this.prisma.artist.findMany();
    const favouriteArtist = await this.prisma.favouriteArtist.findMany();
    const artists = favouriteArtist.map((favorites) =>
      allArtists.find((artist) => artist.id === favorites.artistId),
    );

    const allAlbums = await this.prisma.album.findMany();
    const favAlbumData = await this.prisma.favouriteAlbum.findMany();
    const albums = favAlbumData.map((fav) =>
      allAlbums.find((album) => album.id === fav.albumId),
    );

    const allTracks = await this.prisma.track.findMany();
    const favTrackData = await this.prisma.favouriteTrack.findMany();
    const tracks = favTrackData.map((fav) =>
      allTracks.find((track) => track.id === fav.trackId),
    );

    return {
      albums,
      artists,
      tracks,
    };
  }

  async findTracks(): Promise<string[]> {
    const result = await this.prisma.favouriteTrack.findMany();
    return result.map((track) => track.trackId);
  }

  async findAlbums(): Promise<string[]> {
    const result = await this.prisma.favouriteAlbum.findMany();
    return result.map((album) => album.albumId);
  }

  async findArtists(): Promise<string[]> {
    const result = await this.prisma.favouriteArtist.findMany();
    return result.map((artist) => artist.artistId);
  }

  async createTrack(id: string): Promise<CreateFavoriteDto> {
    const track = await this.prisma.favouriteTrack.findUnique({
      where: {
        trackId: id,
      },
    });

    if (track) {
      return {
        message: 'This track has already added to favourites ealier',
      };
    }

    await this.prisma.favouriteTrack.create({
      data: {
        trackId: id,
      },
    });

    return {
      message: 'Track successfully added to favourites',
    };
  }

  async removeTrack(id: string): Promise<CreateFavoriteDto> {
    await this.prisma.favouriteTrack.delete({
      where: {
        trackId: id,
      },
    });

    return {
      message: 'Track successfully removed from favourites',
    };
  }

  async createArtist(id: string): Promise<CreateFavoriteDto> {
    const artist = await this.prisma.favouriteArtist.findUnique({
      where: {
        artistId: id,
      },
    });

    if (artist) {
      return {
        message: 'This artist has already added to favourites ealier',
      };
    }

    await this.prisma.favouriteArtist.create({
      data: {
        artistId: id,
      },
    });

    return {
      message: 'Artist successfully added to favourites',
    };
  }

  async removeArtist(id: string): Promise<CreateFavoriteDto> {
    await this.prisma.favouriteArtist.delete({
      where: {
        artistId: id,
      },
    });

    return {
      message: 'Artist successfully removed from favourites',
    };
  }

  async createAlbum(id: string): Promise<CreateFavoriteDto> {
    const album = await this.prisma.favouriteAlbum.findUnique({
      where: {
        albumId: id,
      },
    });

    if (album) {
      return {
        message: 'This album has already added to favourites ealier',
      };
    }

    await this.prisma.favouriteAlbum.create({
      data: {
        albumId: id,
      },
    });

    return {
      message: 'Album successfully added to favourites',
    };
  }

  async removeAlbum(id: string) {
    await this.prisma.favouriteAlbum.delete({
      where: {
        albumId: id,
      },
    });

    return {
      message: 'Artist successfully removed from favourites',
    };
  }
}
