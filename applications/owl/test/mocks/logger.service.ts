import { LoggerService } from '@kwokka/common-node';
import { injectable } from 'inversify';

@injectable()
export class LoggerServiceMock extends LoggerService {
  public error = jest.fn();
  public info = jest.fn();
  public warn = jest.fn();
  public debug = jest.fn();
  public withPrefix = jest.fn();
}
