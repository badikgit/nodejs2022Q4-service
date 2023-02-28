import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAlbumDto, UpdateAlbumDto } from './dto';
import { Album } from 'prisma/prisma-client';

@Injectable()
export class AlbumsService {
  constructor(private prisma: PrismaService) {}

  async create(createAlbumDto: CreateAlbumDto): Promise<Album> {
    return await this.prisma.album.create({
      data: { ...createAlbumDto },
    });
  }

  async findAll(): Promise<Album[]> {
    return await this.prisma.album.findMany();
  }

  async findOne(id: string): Promise<Album> {
    return await this.prisma.album.findUnique({
      where: {
        id,
      },
    });
  }

  async update(id: string, updateAlbumDto: UpdateAlbumDto): Promise<Album> {
    const album = await this.prisma.album.findUnique({
      where: {
        id,
      },
    });
    return this.prisma.album.update({
      where: {
        id,
      },
      data: {
        name: updateAlbumDto.name ? updateAlbumDto.name : album.name,
        year: updateAlbumDto.year ? updateAlbumDto.year : album.year,
        artistId:
          updateAlbumDto.artistId || updateAlbumDto.artistId === null
            ? updateAlbumDto.artistId
            : album.artistId,
      },
    });
  }

  async remove(id: string): Promise<Album> {
    const tracks = await this.prisma.track.findMany();
    for (const track of tracks) {
      if (track.albumId === id) {
        await this.prisma.track.update({
          where: {
            id: track.id,
          },
          data: {
            ...track,
            albumId: null,
          },
        });
      }
    }

    const favouriteAlbums = await this.prisma.favouriteAlbum.findMany();

    const isFavouriteAlbum = favouriteAlbums.find(
      (favouriteAlbum) => favouriteAlbum.albumId === id,
    );
    if (isFavouriteAlbum) {
      await this.prisma.favouriteAlbum.delete({
        where: {
          albumId: id,
        },
      });
    }

    return await this.prisma.album.delete({
      where: {
        id,
      },
    });
  }
}
