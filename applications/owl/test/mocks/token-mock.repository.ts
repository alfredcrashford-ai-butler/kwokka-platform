import { TokenRepository } from '../../src/usecase/ports/token.repository';

export class TokenMockRepository extends TokenRepository {
  public updateByIds = jest.fn();
  public iterate = jest.fn();
  public listByIds = jest.fn();
  public deleteMany = jest.fn();
  public find = jest.fn();
  public list = jest.fn();
  public create = jest.fn();
  public update = jest.fn();
  public updateMany = jest.fn();
  public delete = jest.fn();
  public findLastTokenInCorrelation = jest.fn();
}
