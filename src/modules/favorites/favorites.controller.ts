import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  UnprocessableEntityException,
  Post,
} from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { AlbumsService } from '../albums/albums.service';
import { ArtistsService } from '../artists/artists.service';
import { TracksService } from '../tracks/tracks.service';
import { FavoriteResponse } from './entities';
import { CreateFavoriteDto } from './dto';

@Controller('favs')
export class FavoritesController {
  constructor(
    private readonly favoritesService: FavoritesService,
    private readonly albumsService: AlbumsService,
    private readonly artistsService: ArtistsService,
    private readonly tracksService: TracksService,
  ) {}

  @Get()
  async findAll(): Promise<FavoriteResponse> {
    return await this.favoritesService.findAll();
  }

  @Post('track/:id')
  @HttpCode(HttpStatus.CREATED)
  async createTrack(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<CreateFavoriteDto> {
    const track = await this.tracksService.findOne(id);
    if (!track) {
      throw new UnprocessableEntityException(
        'Track with specified id is not found',
      );
    }
    return await this.favoritesService.createTrack(id);
  }

  @Delete('track/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeTrack(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<CreateFavoriteDto> {
    const isFavoriteTrack = (await this.favoritesService.findTracks()).includes(
      id,
    );
    if (!isFavoriteTrack) {
      throw new UnprocessableEntityException(
        'Track with specified id is not in favourites',
      );
    }
    return await this.favoritesService.removeTrack(id);
  }

  @Post('artist/:id')
  @HttpCode(HttpStatus.CREATED)
  async createArtist(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<CreateFavoriteDto> {
    const artist = await this.artistsService.findOne(id);
    if (!artist) {
      throw new UnprocessableEntityException(
        'Artist with specified id is not found',
      );
    }
    return await this.favoritesService.createArtist(id);
  }

  @Delete('artist/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeArtist(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<CreateFavoriteDto> {
    const isFavoriteArtist = (
      await this.favoritesService.findArtists()
    ).includes(id);
    if (!isFavoriteArtist) {
      throw new UnprocessableEntityException(
        'Artist with specified id is not in favourites',
      );
    }
    return await this.favoritesService.removeArtist(id);
  }

  @Post('album/:id')
  @HttpCode(HttpStatus.CREATED)
  async createAlbum(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<CreateFavoriteDto> {
    return await this.favoritesService.createAlbum(id);
  }
  @Delete('album/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeAlbum(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<CreateFavoriteDto> {
    return await this.favoritesService.removeAlbum(id);
  }
}
