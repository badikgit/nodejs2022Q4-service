import { forwardRef, Module } from '@nestjs/common';
import { FavoritesModule } from '../favorites/favorites.module';
import { TracksModule } from '../tracks/tracks.module';
import { AlbumsModule } from '../albums/albums.module';
import { ArtistsController } from './artists.controller';
import { ArtistsService } from './artists.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [
    forwardRef(() => AlbumsModule),
    forwardRef(() => FavoritesModule),
    forwardRef(() => TracksModule),
    forwardRef(() => PrismaModule),
  ],
  controllers: [ArtistsController],
  providers: [ArtistsService],
  exports: [ArtistsService],
})
export class ArtistsModule {}
