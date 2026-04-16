export interface Logger {
  log(...args: any[]): void;
  error(...args: any[]): void;
  warn(...args: any[]): void;
  debug(...args: any[]): void;
}

export const logPrefix = '#KwokkaSdkJs:';

export class DefaultLogger implements Logger {
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
