// eslint-disable-next-line
const Sentry = require('@sentry/node');
import { inject, injectable } from 'inversify';
import { Application } from 'express';
import { LoggerService } from '../logger';
import { ConfigService } from '../config';
import { ErrorTrackerService } from './error-tracker.service';
import { EnvVarName } from '../../../util';

@injectable()
export class SentryErrorTrackerService extends ErrorTrackerService {
  private readonly dsn: string;
  private readonly logger: LoggerService;

  public constructor(
    @inject(ConfigService) private configService: ConfigService,
    @inject(LoggerService) logger: LoggerService,
  ) {
    super();
    this.dsn = this.configService.get(EnvVarName.SentryDsn);
    this.logger = logger.withPrefix('SentryErrorTrackerService:');
  }

  public setup(app?: Application): Promise<void> {
    if (!this.dsn) {
      this.logger.error('Sentry dsn is not provided in the environment!');
      return;
    }

    try {
      this.logger.info('Sentry error tracker initializing...');
      Sentry.init({ dsn: this.dsn });
      if (app) {
        Sentry.setupExpressErrorHandler(app);
      }
      this.logger.info('Sentry error tracker initialized!');
    } catch (error) {
      this.logger.error(`Could not connect to sentry, error: ${error.stack}`);
      return Promise.reject(error);
    }
    return Promise.resolve();
  }

  public captureError(error: Error): Promise<void> {
    try {
      Sentry.captureException(error);
    } catch (e) {
      return Promise.reject(e);
    }
    return Promise.resolve();
  }

  public captureMessage(message: string): Promise<void> {
    try {
      Sentry.captureMessage(message);
    } catch (e) {
      return Promise.reject(e);
    }
    return Promise.resolve();
  }
}
