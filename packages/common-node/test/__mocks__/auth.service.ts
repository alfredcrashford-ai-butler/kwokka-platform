import { injectable } from 'inversify';
import { AuthService } from '../../src/application/service';

@injectable()
export class AuthServiceMock extends AuthService {
  protected getToken = jest.fn();
  protected getAccount = jest.fn();
  protected parseTokenString = jest.fn();
}
