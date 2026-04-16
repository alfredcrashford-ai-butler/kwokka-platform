import { injectable } from 'inversify';

@injectable()
export abstract class ErrorTrackerService {
  public abstract setupErrorTracking(): Promise<void>;
  public abstract captureError(error: Error): Promise<void>;
  public abstract captureMessage(message: string): Promise<void>;
}
