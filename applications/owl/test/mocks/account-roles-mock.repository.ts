import { AccountRolesRepository } from '../../src/usecase/ports/account-roles.repository';

export class AccountRolesMockRepository extends AccountRolesRepository {
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
