import { forwardRef, Module } from '@nestjs/common';
import { FavoritesModule } from '../favorites/favorites.module';
import { ArtistsModule } from '../artists/artists.module';
import { TracksModule } from '../tracks/tracks.module';
import { AlbumsController } from './albums.controller';
import { AlbumsService } from './albums.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [
    forwardRef(() => ArtistsModule),
    forwardRef(() => TracksModule),
    forwardRef(() => FavoritesModule),
    forwardRef(() => PrismaModule),
  ],
  controllers: [AlbumsController],
  providers: [AlbumsService],
  exports: [AlbumsService],
})
export class AlbumsModule {}
