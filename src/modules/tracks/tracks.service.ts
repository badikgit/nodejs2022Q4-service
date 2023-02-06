import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { MemoryDatabase } from 'src/services/db.service';
import { v4 as uuid } from 'uuid';

@Injectable()
export class TracksService {
  create(createTrackDto: CreateTrackDto) {
    const newTrack = {
      id: uuid(),
      name: createTrackDto.name,
      albumId: createTrackDto.albumId,
      artistId: createTrackDto.artistId,
      duration: createTrackDto.duration,
    };
    MemoryDatabase.tracks.push(newTrack);
    return newTrack;
  }

  findAll() {
    return MemoryDatabase.tracks;
  }

  findOne(id: string) {
    const currTrack = MemoryDatabase.tracks.find((track) => track.id === id);
    if (!currTrack) {
      throw new NotFoundException('Track not found');
    }
    return currTrack;
  }

  update(id: string, updateTrackDto: UpdateTrackDto) {
    const currTrack = this.findOne(id);
    if (!currTrack) return;
    const elemIndex = MemoryDatabase.tracks.findIndex(
      (track) => track.id === id,
    );
    MemoryDatabase.tracks[elemIndex] = {
      ...MemoryDatabase.tracks[elemIndex],
      ...updateTrackDto,
    };
    return MemoryDatabase.tracks[elemIndex];
  }

  remove(id: string) {
    const currTrack = this.findOne(id);
    if (!currTrack) return;
    MemoryDatabase.tracks = MemoryDatabase.tracks.filter(
      (track) => track.id !== id,
    );
  }
}
