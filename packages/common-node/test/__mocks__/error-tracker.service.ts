import { injectable } from 'inversify';
import { ErrorTrackerService } from '../../src/application/service';

@injectable()
export class ErrorTrackerServiceMock extends ErrorTrackerService {
  public setup = jest.fn().mockResolvedValue(null);
  public captureError = jest.fn().mockResolvedValue(null);
  public captureMessage = jest.fn().mockResolvedValue(null);
}
