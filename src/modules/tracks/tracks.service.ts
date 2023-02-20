import { Injectable } from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { DBService } from '../db/db.service';

@Injectable()
export class TracksService {
  constructor(private dbService: DBService) {}

  async create(createTrackDto: CreateTrackDto) {
    return await this.dbService.createTrack(createTrackDto);
  }

  async findAll() {
    return await this.dbService.getAllTracks();
  }

  async findOne(id: string) {
    return await this.dbService.getTrack(id);
  }

  async update(id: string, updateTrackDto: UpdateTrackDto) {
    return await this.dbService.updateTrack(id, updateTrackDto);
  }

  async remove(id: string) {
    return await this.dbService.removeTrack(id);
  }
}
