export class LoggerService {
  public log(...args: any[]): void {
    console.log(...args);
  }

  public error(...args: any[]): void {
    console.error(...args);
  }

  public warn(...args: any[]): void {
    console.warn(...args);
  }

  public debug(...args: any[]): void {
    console.debug(...args);
  }
}
