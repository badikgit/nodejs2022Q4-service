import { Injectable } from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { DBService } from '../db/db.service';

@Injectable()
export class AlbumsService {
  constructor(private dbService: DBService) {}

  async create(createAlbumDto: CreateAlbumDto) {
    return await this.dbService.createAlbum(createAlbumDto);
  }

  async findAll() {
    return await this.dbService.getAllAlbums();
  }

  async findOne(id: string) {
    return await this.dbService.getAlbum(id);
  }

  async update(id: string, updateAlbumDto: UpdateAlbumDto) {
    return await this.dbService.updateAlbum(id, updateAlbumDto);
  }

  async remove(id: string) {
    return await this.dbService.removeAlbum(id);
  }
}
