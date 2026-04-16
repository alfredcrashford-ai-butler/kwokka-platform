import { injectable } from 'inversify';
import { LoggerService } from '../../src/application/service';

@injectable()
export class LoggerServiceMock extends LoggerService {
  public error = jest.fn();
  public info = jest.fn();
  public warn = jest.fn();
  public debug = jest.fn();
  public withPrefix = jest.fn().mockImplementation(() => new LoggerServiceMock());
}
