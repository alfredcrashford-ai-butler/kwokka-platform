import { injectable } from 'inversify';
import { ConfigService } from '../../src/application/service';

@injectable()
export class ConfigServiceMock extends ConfigService {
  public get = jest.fn();
}
