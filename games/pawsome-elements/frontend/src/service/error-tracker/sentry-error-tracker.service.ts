import { inject, injectable } from 'inversify';
import { ConfigService } from '../config';
import { ErrorTrackerService } from './error-tracker.service';
import { LoggerService } from '../logger';

@injectable()
export class SentryErrorTrackerService extends ErrorTrackerService {
  private readonly logPrefix = '#SentryErrorTrackerService:';
  private sentry: typeof import('@sentry/browser');
  private logger: LoggerService;

  public constructor(
    @inject(ConfigService) private configService: ConfigService,
    @inject(LoggerService) logger: LoggerService,
  ) {
    super();
    this.logger = logger.withPrefix(this.logPrefix);
  }

  public setup(): Promise<void> {
    if (this.sentry) {
      return Promise.resolve();
    }

    this.logger.log('Fetching sentry bundle...');
    return this.fetchSentryBundle().then((sentry) => {
      this.logger.log('Sentry bundle successfully fetched.');
      const config = this.configService.frontendConfig;
      const sentryTrackingConfig = {
        dsn: config.sentryDsn,
        environment: config.environment,
        integrations: [sentry.browserTracingIntegration()],
      };
      this.sentry = sentry;
      this.sentry.init(sentryTrackingConfig);
      this.logger.log('Sentry is initialized.');
    });
  }

  public captureError(error: Error): Promise<void> {
    try {
      this.sentry.captureException(error);
    } catch (e) {
      return Promise.reject(e);
    }
    return Promise.resolve();
  }

  public captureMessage(message: string): Promise<void> {
    try {
      this.sentry.captureMessage(message);
    } catch (e) {
      return Promise.reject(e);
    }
    return Promise.resolve();
  }

  private fetchSentryBundle(): Promise<typeof import('@sentry/browser')> {
    return import('@sentry/browser');
  }
}
