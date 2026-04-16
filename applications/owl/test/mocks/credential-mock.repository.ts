import { CredentialRepository } from '../../src/usecase/ports/credential.repository';

export class CredentialMockRepository extends CredentialRepository {
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
}
