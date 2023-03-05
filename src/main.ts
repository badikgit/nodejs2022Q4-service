import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { cwd, exit } from 'process';
import { parse } from 'yaml';
import { SwaggerModule } from '@nestjs/swagger';
import { LoggingService } from './logging/logging.service';
import { HttpExceptionFilter } from './logging/http-exeption.filter';

dotenv.config();

const PORT = Number(process.env.PORT) || 4000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const logger = app.get(LoggingService);
  app.useGlobalFilters(new HttpExceptionFilter(logger));

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.enableCors();

  const file = await readFile(join(cwd(), 'doc', 'api.yaml'), 'utf8');
  const document = parse(file);

  SwaggerModule.setup('doc', app, document);

  await app.listen(PORT);

  process.on('uncaughtException', (err) => {
    logger.error(`Uncaught Exception thrown: ${err}`);
    exit(1);
  });

  process.on('unhandledRejection', (reason) => {
    logger.error(`Unhandled Rejection at Promise with reason: ${reason}`);
  });
}
bootstrap();
