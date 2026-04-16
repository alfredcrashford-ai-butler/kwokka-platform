export interface Logger {
  info(...args: any[]): void;
  error(...args: any[]): void;
  warn(...args: any[]): void;
  debug(...args: any[]): void;
}

export const logPrefix = '#KwokkaSdkNode:';

export class DefaultLogger implements Logger {
  public info(...args: any[]): void {
    console.log(logPrefix, ...args);
  }

  public error(...args: any[]): void {
    console.error(logPrefix, ...args);
  }

  public warn(...args: any[]): void {
    console.warn(logPrefix, ...args);
  }

  public debug(...args: any[]): void {
    console.debug(logPrefix, ...args);
  }
}
