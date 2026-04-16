import { AccessRoleRepository } from '../../src/usecase/ports/access-role.repository';

export class AccessRoleMockRepository extends AccessRoleRepository {
  public updateByIds = jest.fn();
  public iterate = jest.fn();
  public deleteMany = jest.fn();
  public listByIds = jest.fn();
  public find = jest.fn();
  public list = jest.fn();
  public create = jest.fn();
  public update = jest.fn();
  public updateMany = jest.fn();
  public delete = jest.fn();
}
