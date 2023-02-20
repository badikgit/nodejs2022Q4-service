import { Injectable } from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { DBService } from '../db/db.service';

@Injectable()
export class ArtistsService {
  constructor(private dbService: DBService) {}

  async create(createArtistDto: CreateArtistDto) {
    return await this.dbService.createArtist(createArtistDto);
  }

  async findAll() {
    return await this.dbService.getAllArtists();
  }

  async findOne(id: string) {
    return await this.dbService.getArtist(id);
  }

  async update(id: string, updateArtistDto: UpdateArtistDto) {
    return await this.dbService.updateArtist(id, updateArtistDto);
  }

  async remove(id: string) {
    return await this.dbService.removeArtist(id);
  }
}
