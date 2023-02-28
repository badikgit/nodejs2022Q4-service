import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateArtistDto, UpdateArtistDto } from './dto';
import { Artist } from 'prisma/prisma-client';

@Injectable()
export class ArtistsService {
  constructor(private prisma: PrismaService) {}

  async create(createArtistDto: CreateArtistDto): Promise<Artist> {
    return await this.prisma.artist.create({
      data: { ...createArtistDto },
    });
  }

  async findAll(): Promise<Artist[]> {
    return await this.prisma.artist.findMany();
  }

  async findOne(id: string): Promise<Artist> {
    return await this.prisma.artist.findUnique({
      where: {
        id,
      },
    });
  }

  async update(id: string, updateArtistDto: UpdateArtistDto): Promise<Artist> {
    const artist = await this.prisma.artist.findUnique({
      where: {
        id,
      },
    });

    const updatedArtist = await this.prisma.artist.update({
      where: {
        id,
      },
      data: {
        ...artist,
        name: updateArtistDto.name ? updateArtistDto.name : artist.name,
        grammy:
          updateArtistDto.grammy !== undefined
            ? updateArtistDto.grammy
            : artist.grammy,
      },
    });

    return updatedArtist;
  }

  async remove(id: string): Promise<Artist> {
    const albums = await this.prisma.album.findMany();
    for (const album of albums) {
      if (album.artistId === id) {
        await this.prisma.album.update({
          where: {
            id: album.id,
          },
          data: {
            ...album,
            artistId: null,
          },
        });
      }
    }

    const tracks = await this.prisma.track.findMany();
    for (const track of tracks) {
      if (track.artistId === id) {
        await this.prisma.track.update({
          where: {
            id: track.id,
          },
          data: {
            ...track,
            artistId: null,
          },
        });
      }
    }

    const favouriteArtists = await this.prisma.favouriteArtist.findMany();

    const isFavouriteArtist = favouriteArtists.find(
      (favouriteArtist) => favouriteArtist.artistId === id,
    );
    if (isFavouriteArtist) {
      await this.prisma.favouriteArtist.delete({
        where: {
          artistId: id,
        },
      });
    }

    return await this.prisma.artist.delete({
      where: {
        id,
      },
    });
  }
}
