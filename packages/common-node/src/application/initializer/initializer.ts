import { inject, injectable } from 'inversify';
import { LoggerService } from '../service';

@injectable()
export abstract class Initializer {
  @inject(LoggerService)
  private _logger: LoggerService;
  private _loggerInstance: LoggerService;

  protected get logger(): LoggerService {
    if (!this._loggerInstance) {
      this._loggerInstance = this._logger.withPrefix(`${this.constructor.name}:`);
    }
    return this._loggerInstance;
  };

  public async execute(): Promise<void> {
    try {
      this.logger.info('initializer started.');
      await this.intialize();
      this.logger.info('initializer complete.');
    } catch (e: any) {
      this.logger.error('initializer failed to complete, error: ', e);
      throw e;
    }
  }

  protected abstract intialize(): Promise<void>;
}
