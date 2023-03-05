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
import { AlbumsService } from './albums.service';
import { ArtistsService } from '../artists/artists.service';
import { CreateAlbumDto, UpdateAlbumDto } from './dto';
import { Album } from 'prisma/prisma-client';

@Controller('album')
export class AlbumsController {
  constructor(
    private readonly albumsService: AlbumsService,
    private readonly artistsService: ArtistsService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body(new ValidationPipe({ transform: true }))
    createAlbumDto: CreateAlbumDto,
  ): Promise<Album> {
    if (createAlbumDto.artistId) {
      const artist = await this.artistsService.findOne(createAlbumDto.artistId);
      if (!artist) {
        throw new NotFoundException('Artist with specified id is not found');
      }
    }
    return await this.albumsService.create(createAlbumDto);
  }

  @Get()
  async findAll(): Promise<Album[]> {
    return await this.albumsService.findAll();
  }

  @Get(':id')
  async findOne(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<Album> {
    const album = await this.albumsService.findOne(id);

    if (!album) {
      throw new NotFoundException('Album with specified id not found');
    }

    return album;
  }

  @Put(':id')
  async update(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body(ValidationPipe) updateAlbumDto: UpdateAlbumDto,
  ): Promise<Album> {
    if (updateAlbumDto.artistId) {
      const artist = await this.artistsService.findOne(updateAlbumDto.artistId);
      if (!artist) {
        throw new NotFoundException('Artist with specified id is not found');
      }
    }

    const updatedAlbum = await this.albumsService.findOne(id);

    if (!updatedAlbum) {
      throw new NotFoundException('Album with specified id not found');
    }

    return await this.albumsService.update(id, updateAlbumDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<Album> {
    const removedAlbum = await this.albumsService.findOne(id);

    if (!removedAlbum) {
      throw new NotFoundException('Album with specified id not found');
    }

    return await this.albumsService.remove(id);
  }
}
