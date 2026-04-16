import { inject, injectable, unmanaged } from 'inversify';
import { Logger, createLogger, format, transport, transports } from 'winston';
import { LoggerService } from './logger.service';
import { ConfigService } from '../config';
import { EnvVarName } from '../../../util';

@injectable()
export class WinstonLoggerService extends LoggerService {
  private logger: Logger;
  private serviceName: string;

  public constructor(
    @inject(ConfigService) private configService: ConfigService,
    @unmanaged() private prefix: string = '',
  ) {
    super();

    this.serviceName = this.configService.get(EnvVarName.ServiceName);
    const myFormat = format.printf((...args) => this.format.bind(this)(...args));
    const level = this.configService.get(EnvVarName.LogLevel);

    let configTransports: transport[] = [
      new transports.Console({
        format: format.combine(format.colorize({ all: true }), format.timestamp(), myFormat),
      }),
    ];

    this.logger = createLogger({
      format: format.combine(format.timestamp(), myFormat),
      transports: configTransports,
      level,
    });
  }

  public error(...args: any[]): void {
    this.log('error', ...args);
  }

  public info(...args: any[]): void {
    this.log('info', ...args);
  }

  public warn(...args: any[]): void {
    this.log('warn', ...args);
  }

  public debug(...args: any[]): void {
    this.log('debug', ...args);
  }

  public withPrefix(prefix: string): LoggerService {
    return new WinstonLoggerService(this.configService, prefix);
  }

  private log(method: 'info' | 'warn' | 'error' | 'debug', ...args: any[]): void {
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

          return el.toString() || el;
        })
        .join(' '),
    );
  }

  private format({ level, message, timestamp }): string {
    const prefix = this.prefix ? `#${this.prefix} ` : '';
    return `[${timestamp}][${this.serviceName}][${level}]: ${prefix}${message}`;
  }
}
