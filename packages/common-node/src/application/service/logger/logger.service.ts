import { injectable } from 'inversify';

@injectable()
export abstract class LoggerService {
  public abstract error(...args: any[]): void;
  public abstract info(...args: any[]): void;
  public abstract warn(...args: any[]): void;
  public abstract debug(...args: any[]): void;
  public abstract withPrefix(prefix: string): LoggerService;
}
