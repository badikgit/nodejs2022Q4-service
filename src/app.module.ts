import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ArtistsModule } from './modules/artists/artists.module';
import { AlbumsModule } from './modules/albums/albums.module';
import { TracksModule } from './modules/tracks/tracks.module';
import { FavoritesModule } from './modules/favorites/favorites.module';
import { UsersModule } from './modules/users/users.module';
import { DBModule } from './modules/db/db.module';
import { PrismaModule } from './modules/prisma/prisma.module';

@Module({
  imports: [
    ArtistsModule,
    AlbumsModule,
    FavoritesModule,
    TracksModule,
    UsersModule,
    DBModule,
    PrismaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
