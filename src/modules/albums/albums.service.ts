import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { MemoryDatabase } from 'src/services/db.service';
import { v4 as uuid } from 'uuid';

@Injectable()
export class AlbumsService {
  create(createAlbumDto: CreateAlbumDto) {
    const newAlbum = {
      id: uuid(),
      name: createAlbumDto.name,
      year: createAlbumDto.year,
      artistId: createAlbumDto.artistId,
    };
    MemoryDatabase.albums.push(newAlbum);
    return newAlbum;
  }

  findAll() {
    return MemoryDatabase.albums;
  }

  findOne(id: string) {
    const currAlbum = MemoryDatabase.albums.find((album) => album.id === id);
    if (!currAlbum) {
      throw new NotFoundException('Album not found');
    }
    return currAlbum;
  }

  update(id: string, updateAlbumDto: UpdateAlbumDto) {
    const currAlbum = this.findOne(id);
    if (!currAlbum) return;
    const elemIndex = MemoryDatabase.albums.findIndex(
      (album) => album.id === id,
    );

    MemoryDatabase.albums[elemIndex] = {
      ...MemoryDatabase.albums[elemIndex],
      ...updateAlbumDto,
    };

    return MemoryDatabase.albums[elemIndex];
  }

  remove(id: string) {
    const currAlbum = this.findOne(id);
    if (!currAlbum) return;
    MemoryDatabase.albums = MemoryDatabase.albums.filter(
      (album) => album.id !== id,
    );
  }
}
