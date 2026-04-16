import { inject, injectable } from 'inversify';
import { ErrorTrackerProvider } from './error-tracker-provider';
import { LoggerService } from '../logger/logger.service';

const SETUP_MESSAGE =
  '[DevErrorTrackerProvider] development error tracker has been successfully initialized. Verify this message does not appear in production';
const TRACKER_PROVIDER_WINDOW_TOKEN = 'TRACKER_PROVIDER';
const TRACKED_MESSAGES_LIMIT = 200;
const TRACKED_ERRORS_LIMIT = 50;

@injectable()
export class ErrorTrackerProviderDevImpl extends ErrorTrackerProvider {
  public trackedErrors: Error[] = [];
  public trackedMessages: string[] = [];

  public constructor(@inject(LoggerService) private logger: LoggerService) {
    super();
  }

  public setup(): Promise<void> {
    window[TRACKER_PROVIDER_WINDOW_TOKEN] = this;

    const styles = 'color: indianred; background-color: black; display: inline-block; padding: 4px;';
    this.logger.log(`%c${SETUP_MESSAGE}`, styles);

    return Promise.resolve();
  }

  public captureError(error: Error): Promise<void> {
    this.trackedErrors = [...this.trackedErrors, error].slice(-TRACKED_ERRORS_LIMIT);
    return Promise.resolve();
  }

  public captureMessage(message: string): Promise<void> {
    this.trackedMessages = [...this.trackedMessages, message].slice(-TRACKED_MESSAGES_LIMIT);
    return Promise.resolve();
  }
}
