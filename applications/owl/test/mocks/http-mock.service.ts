import { HttpService } from '@kwokka/common-node';

export class HttpMockService extends HttpService {
  public get = jest.fn();
  public post = jest.fn();
  public put = jest.fn();
  public patch = jest.fn();
  public delete = jest.fn();
}
