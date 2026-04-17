import { injectable } from 'inversify';

@injectable()
export class LoggerService {
  public constructor(private readonly prefix = '') {}

  public log(...args: any[]): void {
    // eslint-disable-next-line no-console
    console.log(...this.format(...args));
  }

  public error(...args: any[]): void {
    // eslint-disable-next-line no-console
    console.error(...this.format(...args));
  }

  public warn(...args: any[]): void {
    // eslint-disable-next-line no-console
    console.warn(...this.format(...args));
  }

  public debug(...args: any[]): void {
    // eslint-disable-next-line no-console
    console.debug(...this.format(...args));
  }

  public withPrefix(prefix: string): LoggerService {
    return new LoggerService(prefix);
  }

  private format(...args: any[]): any[] {
    return this.prefix ? [this.prefix, ...args] : args;
  }
}
