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
import { ArtistsService } from './artists.service';
import { CreateArtistDto, UpdateArtistDto } from './dto';
import { Artist } from 'prisma/prisma-client';

@Controller('artist')
export class ArtistsController {
  constructor(private readonly artistsService: ArtistsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body(new ValidationPipe({ transform: true }))
    createArtistDto: CreateArtistDto,
  ): Promise<Artist> {
    return await this.artistsService.create(createArtistDto);
  }

  @Get()
  async findAll(): Promise<Artist[]> {
    return await this.artistsService.findAll();
  }

  @Get(':id')
  async findOne(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<Artist> {
    const artist = await this.artistsService.findOne(id);
    if (!artist) {
      throw new NotFoundException('Artist with specified id is not found');
    }
    return artist;
  }

  @Put(':id')
  async update(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body(ValidationPipe) updateArtistDto: UpdateArtistDto,
  ): Promise<Artist> {
    const updatedArtist = await this.artistsService.findOne(id);
    if (!updatedArtist) {
      throw new NotFoundException('Artist with specified id is not found');
    }
    return await this.artistsService.update(id, updateArtistDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<Artist> {
    const removedArtist = await this.artistsService.findOne(id);
    if (!removedArtist) {
      throw new NotFoundException('Artist with specified id is not found');
    }
    return await this.artistsService.remove(id);
  }
}
