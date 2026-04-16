import { inject, injectable } from 'inversify';
import { ErrorTrackerProvider } from './error-tracker-provider';
import { ConfigService } from '../config/config.service';

interface Sentry {
  init(options: { dsn: string }): void;
  captureMessage(message: string): string;
  captureException(error: Error): string;
}

@injectable()
export class ErrorTrackerProviderSentryImpl extends ErrorTrackerProvider {
  private sentry: Sentry;

  public constructor(@inject(ConfigService) private configService: ConfigService) {
    super();
  }

  public setup(): Promise<void> {
    if (this.sentry) {
      return Promise.resolve();
    }

    return this.fetchSentryBundle().then((sentry) => {
      const config = this.configService.frontendConfig;
      const sentryTrackingConfig = config.trackingConfig.sentry!;
      this.sentry = sentry;
      this.sentry.init(sentryTrackingConfig);
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

  private fetchSentryBundle(): Promise<Sentry> {
    return import('@sentry/browser');
  }
}
