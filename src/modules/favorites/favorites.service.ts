import { Injectable } from '@nestjs/common';
import { DBService } from '../db/db.service';

@Injectable()
export class FavoritesService {
  constructor(private dbService: DBService) {}

  async findAll() {
    return await this.dbService.getFavorites();
  }

  async createTrack(id: string) {
    return await this.dbService.createFavoriteTrack(id);
  }

  async removeTrack(id: string) {
    return await this.dbService.removeFavoriteTrack(id);
  }

  async createArtist(id: string) {
    return await this.dbService.createFavoriteArtist(id);
  }

  async removeArtist(id: string) {
    return await this.dbService.removeFavoriteArtist(id);
  }

  async createAlbum(id: string) {
    return await this.dbService.createFavoriteAlbum(id);
  }

  async removeAlbum(id: string) {
    return await this.dbService.removeFavoriteAlbum(id);
  }
}
