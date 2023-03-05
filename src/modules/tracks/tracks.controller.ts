import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  ValidationPipe,
} from '@nestjs/common';
import { ArtistsService } from '../artists/artists.service';
import { AlbumsService } from '../albums/albums.service';
import { TracksService } from './tracks.service';
import { CreateTrackDto, UpdateTrackDto } from './dto';
import { Track } from '@prisma/client';

@Controller('track')
export class TracksController {
  constructor(
    private readonly tracksService: TracksService,
    private readonly artistsService: ArtistsService,
    private readonly albumsService: AlbumsService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body(new ValidationPipe({ transform: true }))
    createTrackDto: CreateTrackDto,
  ): Promise<Track> {
    if (createTrackDto.albumId) {
      const album = await this.albumsService.findOne(createTrackDto.albumId);
      if (!album) {
        throw new NotFoundException('Album with specified id is not found');
      }
    }
    if (createTrackDto.artistId) {
      const artist = await this.artistsService.findOne(createTrackDto.artistId);
      if (!artist) {
        throw new NotFoundException('Artist with specified id is not found');
      }
    }

    return await this.tracksService.create(createTrackDto);
  }

  @Get()
  async findAll(): Promise<Track[]> {
    return await this.tracksService.findAll();
  }

  @Get(':id')
  async findOne(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<Track> {
    const track = await this.tracksService.findOne(id);
    if (!track) {
      throw new NotFoundException('Track with specified id is not found');
    }
    return track;
  }

  @Put(':id')
  async update(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body(ValidationPipe) updateTrackDto: UpdateTrackDto,
  ): Promise<Track> {
    const track = await this.tracksService.findOne(id);
    if (!track) {
      throw new NotFoundException('Track with specified id is not found');
    }
    if (updateTrackDto.albumId) {
      const album = await this.albumsService.findOne(updateTrackDto.albumId);
      if (!album) {
        throw new NotFoundException('Album with specified id is not found');
      }
    }
    if (updateTrackDto.artistId) {
      const artist = await this.artistsService.findOne(updateTrackDto.artistId);
      if (!artist) {
        throw new NotFoundException('Artist with specified id is not found');
      }
    }
    return await this.tracksService.update(id, updateTrackDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<Track> {
    const track = await this.tracksService.findOne(id);
    if (!track) {
      throw new NotFoundException('Track with specified id is not found');
    }
    return await this.tracksService.remove(id);
  }
}
