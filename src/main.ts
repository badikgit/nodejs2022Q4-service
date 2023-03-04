import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { cwd } from 'process';
import { parse } from 'yaml';
import { SwaggerModule } from '@nestjs/swagger';

dotenv.config();

const PORT = Number(process.env.PORT) || 4000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.enableCors();

  const file = await readFile(join(cwd(), 'doc', 'api.yaml'), 'utf8');
  const document = parse(file);

  SwaggerModule.setup('doc', app, document);

  await app.listen(PORT);
}
bootstrap();
