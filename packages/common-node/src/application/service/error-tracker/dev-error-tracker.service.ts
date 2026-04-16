import { inject, injectable } from 'inversify';
import { LoggerService } from '../logger';
import { ErrorTrackerService } from './error-tracker.service';

const SETUP_MESSAGE = 'Dev error tracker was initialized. Verify this message does not appear in prod!';
const TRACKED_MESSAGES_LIMIT = 200;
const TRACKED_ERRORS_LIMIT = 50;

@injectable()
export class DevErrorTrackerService extends ErrorTrackerService {
  public trackedErrors: Error[] = [];
  public trackedMessages: string[] = [];

  public constructor(@inject(LoggerService) private logger: LoggerService) {
    super();
  }

  public setup(): Promise<void> {
    this.logger.info(SETUP_MESSAGE);
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
