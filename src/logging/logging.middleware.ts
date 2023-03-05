import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { LoggingService } from './logging.service';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  private logger = new LoggingService('HTTP');

  use(request: Request, response: Response, next: NextFunction): void {
    const { method, protocol, hostname, originalUrl, query, body } = request;

    response.on('finish', () => {
      const { statusCode } = response;

      this.logger.log(
        `Request: ${method} ${protocol}://${hostname}${originalUrl} query: ${JSON.stringify(
          query,
        )} body: ${JSON.stringify(body)}; Response: ${statusCode}`,
      );
    });

    next();
  }
}
