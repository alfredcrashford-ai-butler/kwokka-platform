import { injectable } from 'inversify';

@injectable()
export abstract class LoggerService {
  public abstract log(...args: any[]): void;
  public abstract error(...args: any[]): void;
  public abstract warn(...args: any[]): void;
}
