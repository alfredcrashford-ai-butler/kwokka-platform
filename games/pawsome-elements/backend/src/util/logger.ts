import { Logger as WinstonLogger, createLogger, format, transport, transports } from 'winston';
import { ConfigUtil } from './config.util';
import { EnvVarName } from './env-var-name';

export class Logger {
  private static _logger: WinstonLogger;

  public static info(...args: any[]): void {
    this.print('info', ...args);
  }

  public static error(...args: any[]): void {
    this.print('error', ...args);
  }

  public static warn(...args: any[]): void {
    this.print('warn', ...args);
  }

  public static debug(...args: any[]): void {
    this.print('debug', ...args);
  }

  private static get logger(): WinstonLogger {
    if (!this._logger) {
      this.createLogger();
    }

    return this._logger;
  }

  private static createLogger(): void {
    const myFormat = format.printf(this.format.bind(this));
    const level = ConfigUtil.get(EnvVarName.LogLevel);

    let configTransports: transport[] = [
      new transports.Console({
        format: format.combine(format.colorize(), format.timestamp(), myFormat),
      }),
    ];

    this._logger = createLogger({
      format: format.combine(format.timestamp(), myFormat),
      transports: configTransports,
      level,
    });
  }

  private static print(method: 'info' | 'warn' | 'error' | 'debug', ...args: any[]): void {
    this.logger[method](
      args
        .map((el) => {
          if (el instanceof Error) {
            return el.stack || el.toString() || el;
          }

          if (Array.isArray(el) || typeof el === 'object') {
            try {
              return JSON.stringify(el);
            } catch {
              return el;
            }
          }

          return el?.toString() || el;
        })
        .join(' '),
    );
  }

  private static format({ level, message, timestamp }): string {
    return `[${timestamp}][${level}]: ${message}`;
  }
}
