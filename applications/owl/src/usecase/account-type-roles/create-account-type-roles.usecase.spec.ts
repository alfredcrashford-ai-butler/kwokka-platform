import { AccessRoleEntity, AccountEntityType, AccountTypeRolesEntity } from '@kwokka/entities';
import { UsecaseException } from '@kwokka/common-node';
import { CreateAccountTypeRolesUsecase } from './create-account-type-roles.usecase';
import { AccountTypeRolesMockRepository } from '../../../test/mocks/account-type-roles-mock.repository';
import { AccessRoleMockRepository } from '../../../test/mocks/access-role-mock.repository';

describe(CreateAccountTypeRolesUsecase, () => {
  let usecase: CreateAccountTypeRolesUsecase;
  let accountTypeRolesRepo: AccountTypeRolesMockRepository;
  let accessRoleRepo: AccessRoleMockRepository;

  beforeEach(() => {
    accountTypeRolesRepo = new AccountTypeRolesMockRepository();
    accessRoleRepo = new AccessRoleMockRepository();
    usecase = new CreateAccountTypeRolesUsecase(accountTypeRolesRepo, accessRoleRepo);
  });

  it('exists', () => {
    expect(usecase).toBeTruthy();
  });

  it('throws UsecaseException if account type roles with given type already exist', async () => {
    const accountTypeRoles = new AccountTypeRolesEntity({ type: AccountEntityType.User, accessRolesIds: ['r1', 'r2'] });
    accountTypeRolesRepo.find.mockResolvedValue(accountTypeRoles);
    const accessRole1 = new AccessRoleEntity({ name: 'r1', description: 'lorem', accessRightsIds: ['1'] });
    const accessRole2 = new AccessRoleEntity({ name: 'r2', description: 'lorem', accessRightsIds: ['2'] });
    accessRoleRepo.listByIds.mockResolvedValue({ payload: [accessRole1, accessRole2] });

    await expect(usecase.perform(accountTypeRoles)).rejects.toBeInstanceOf(UsecaseException);
  });

  it('throws UsecaseException if one of the account roles does not exist', async () => {
    const accountTypeRoles = new AccountTypeRolesEntity({ type: AccountEntityType.User, accessRolesIds: ['r1', 'r2'] });
    accountTypeRolesRepo.find.mockResolvedValue(null);
    const accessRole1 = new AccessRoleEntity({ name: 'r1', description: 'lorem', accessRightsIds: ['1'] });
    accessRoleRepo.listByIds.mockResolvedValue({ payload: [accessRole1] });

    await expect(usecase.perform(accountTypeRoles)).rejects.toBeInstanceOf(UsecaseException);
  });

  it('creates account type roles and stores it', async () => {
    const accountTypeRoles = new AccountTypeRolesEntity({ type: AccountEntityType.User, accessRolesIds: ['r1', 'r2'] });
    accountTypeRolesRepo.find.mockResolvedValue(null);
    accountTypeRolesRepo.create.mockResolvedValue(accountTypeRoles);
    const accessRole1 = new AccessRoleEntity({ name: 'r1', description: 'lorem', accessRightsIds: ['1'] });
    const accessRole2 = new AccessRoleEntity({ name: 'r2', description: 'lorem', accessRightsIds: ['2'] });
    accessRoleRepo.listByIds.mockResolvedValue({ payload: [accessRole1, accessRole2] });

    const result = await usecase.perform(accountTypeRoles);

    expect(accountTypeRolesRepo.create).toBeCalledWith(accountTypeRoles);
    expect(result).toEqual(accountTypeRoles);
    expect(accessRoleRepo.listByIds).toBeCalledWith(['r1', 'r2']);
  });
});
