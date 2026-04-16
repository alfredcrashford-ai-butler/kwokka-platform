import { injectable } from 'inversify';
import { Application } from 'express';

@injectable()
export abstract class ErrorTrackerService {
  public abstract setup(app?: Application): Promise<void>;
  public abstract captureError(error: Error): Promise<void>;
  public abstract captureMessage(message: string): Promise<void>;
}
