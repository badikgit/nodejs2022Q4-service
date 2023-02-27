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
    return await this.prisma.artist.delete({
      where: {
        id,
      },
    });
  }
}
