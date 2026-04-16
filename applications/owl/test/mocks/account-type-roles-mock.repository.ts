import { AccountTypeRolesRepository } from '../../src/usecase/ports/account-type-roles.repository';

export class AccountTypeRolesMockRepository extends AccountTypeRolesRepository {
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
