import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ArtistsModule } from './modules/artists/artists.module';
import { AlbumsModule } from './modules/albums/albums.module';
import { TracksModule } from './modules/tracks/tracks.module';

@Module({
  imports: [ArtistsModule, AlbumsModule, TracksModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
