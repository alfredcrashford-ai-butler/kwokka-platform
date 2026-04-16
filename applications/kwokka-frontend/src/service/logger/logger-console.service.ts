import { injectable } from 'inversify';
import { LoggerService } from './logger.service';

@injectable()
export class LoggerServiceConsoleImpl extends LoggerService {
  public log(...args: any[]): void {
    // eslint-disable-next-line no-console
    console.log(...args);
  }

  public error(...args: any[]): void {
    // eslint-disable-next-line no-console
    console.error(...args);
  }

  public warn(...args: any[]): void {
    // eslint-disable-next-line no-console
    console.warn(...args);
  }
}
