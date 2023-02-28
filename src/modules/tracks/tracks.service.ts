import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTrackDto, UpdateTrackDto } from './dto';
import { Track } from '@prisma/client';

@Injectable()
export class TracksService {
  constructor(private prisma: PrismaService) {}

  async create(createTrackDto: CreateTrackDto): Promise<Track> {
    return await this.prisma.track.create({
      data: { ...createTrackDto },
    });
  }

  async findAll(): Promise<Track[]> {
    return await this.prisma.track.findMany();
  }

  async findOne(id: string): Promise<Track> {
    return await this.prisma.track.findUnique({
      where: {
        id,
      },
    });
  }

  async update(id: string, updateTrackDto: UpdateTrackDto): Promise<Track> {
    const track = await this.prisma.track.findUnique({
      where: {
        id,
      },
    });
    return this.prisma.track.update({
      where: {
        id,
      },
      data: {
        ...track,
        name: updateTrackDto.name ? updateTrackDto.name : track.name,
        artistId:
          updateTrackDto.artistId || updateTrackDto.artistId === null
            ? updateTrackDto.artistId
            : track.artistId,
        albumId:
          updateTrackDto.albumId || updateTrackDto.albumId === null
            ? updateTrackDto.albumId
            : track.albumId,
        duration: updateTrackDto.duration
          ? updateTrackDto.duration
          : track.duration,
      },
    });
  }

  async remove(id: string): Promise<Track> {
    return await this.prisma.track.delete({
      where: {
        id,
      },
    });
  }
}
