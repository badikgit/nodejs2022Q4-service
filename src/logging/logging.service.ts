import { Injectable, Logger } from '@nestjs/common';
import { appendFile, access, mkdir, open, rename, stat } from 'fs/promises';
import { join } from 'path';
import { cwd } from 'process';

type LogMethods = 'error' | 'warn' | 'log' | 'debug' | 'verbose';

@Injectable()
export class LoggingService extends Logger {
  private logLevel: number;

  constructor(name: string) {
    super(name);
    this.logLevel = Number(process.env.LOG_LEVEL) || 0;
  }

  async error(message: any, ...optionalParams: any[]) {
    await this.logMessage('error', 0, message, ...optionalParams);
  }

  async warn(message: any, ...optionalParams: any[]) {
    await this.logMessage('warn', 1, message, ...optionalParams);
  }

  async log(message: any, ...optionalParams: any[]) {
    await this.logMessage('log', 2, message, ...optionalParams);
  }

  async debug(message: any, ...optionalParams: any[]) {
    await this.logMessage('debug', 3, message, ...optionalParams);
  }

  async verbose(message: any, ...optionalParams: any[]) {
    await this.logMessage('verbose', 4, message, ...optionalParams);
  }

  async logMessage(
    logMethod: LogMethods,
    level: number,
    message: string,
    ...optionalParams: any[]
  ) {
    if (level > this.logLevel) return;

    super[logMethod](message, ...optionalParams);
    await this.writeToFile(logMethod, message);
  }

  async writeToFile(level: LogMethods, message: string) {
    const commonReportPath = join(cwd(), 'logs', 'common-report.log');
    const errorsReportPath = join(cwd(), 'logs', 'errors-report.log');
    try {
      await access(join(cwd(), 'logs'));
    } catch {
      await mkdir('logs');
    }
    try {
      await access(commonReportPath);
    } catch {
      await open(commonReportPath, 'w');
    }
    try {
      await access(errorsReportPath);
    } catch {
      await open(errorsReportPath, 'w');
    }

    const maxSize = Number(process.env.MAX_LOG_FILE_SIZE) || 10;

    try {
      const stats = await stat(commonReportPath);

      if (stats.size > maxSize * 1024) {
        await rename(
          commonReportPath,
          commonReportPath.replace(/.log$/, `-${new Date().getTime()}-old.log`),
        );
      }
    } catch (err) {}

    const time = new Date().toLocaleString();
    await appendFile(
      commonReportPath,
      `${time}   ${level.toUpperCase()} - ${message}\n`,
    );

    if (level === 'error') {
      try {
        const errorsStats = await stat(errorsReportPath);

        if (errorsStats.size > maxSize * 1024) {
          await rename(
            errorsReportPath,
            errorsReportPath.replace(
              /.log$/,
              `-${new Date().getTime()}-old.log`,
            ),
          );
        }
      } catch (err) {}

      await appendFile(
        errorsReportPath,
        `${time}   ${level.toUpperCase()} - ${message}\n`,
      );
    }
  }
}
