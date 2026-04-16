import { AccessRoleEntity, AccountEntityType, AccountTypeRolesEntity } from '@kwokka/entities';
import { UsecaseException } from '@kwokka/common-node';
import { AccountTypeRolesMockRepository } from '../../../test/mocks/account-type-roles-mock.repository';
import { AccessRoleMockRepository } from '../../../test/mocks/access-role-mock.repository';
import { UpdateAccountTypeRolesUsecase } from './update-account-type-roles.usecase';

describe(UpdateAccountTypeRolesUsecase, () => {
  let usecase: UpdateAccountTypeRolesUsecase;
  let accountTypeRolesRepo: AccountTypeRolesMockRepository;
  let accessRoleRepo: AccessRoleMockRepository;

  beforeEach(() => {
    accountTypeRolesRepo = new AccountTypeRolesMockRepository();
    accessRoleRepo = new AccessRoleMockRepository();
    usecase = new UpdateAccountTypeRolesUsecase(accountTypeRolesRepo, accessRoleRepo);
  });

  it('exists', () => {
    expect(usecase).toBeTruthy();
  });

  it('throws UsecaseException if account type roles could not be found', async () => {
    accountTypeRolesRepo.find.mockResolvedValue(null);

    await expect(usecase.perform('12345', { type: AccountEntityType.User })).rejects.toBeInstanceOf(UsecaseException);
  });

  it('throws UsecaseException if type is provided', async () => {
    const accountTypeRoles = new AccountTypeRolesEntity({ type: AccountEntityType.User, accessRolesIds: ['r1', 'r2'] });
    accountTypeRolesRepo.find.mockResolvedValue(accountTypeRoles);

    await expect(usecase.perform('12345', { type: AccountEntityType.User })).rejects.toBeInstanceOf(UsecaseException);
  });

  it('throws UsecaseException if one of the account roles does not exist', async () => {
    accountTypeRolesRepo.find.mockResolvedValue(null);
    const accessRole1 = new AccessRoleEntity({ name: 'r1', description: 'lorem', accessRightsIds: ['1'] });
    accessRoleRepo.listByIds.mockResolvedValue({ payload: [accessRole1] });

    await expect(usecase.perform('12345', { accessRolesIds: ['r1', 'r2'] })).rejects.toBeInstanceOf(UsecaseException);
  });

  it('updates account type roles and stores it', async () => {
    const accountTypeRoles = new AccountTypeRolesEntity({ type: AccountEntityType.User, accessRolesIds: ['r1', 'r2'] });
    accountTypeRolesRepo.find.mockResolvedValue(accountTypeRoles);
    accountTypeRolesRepo.update.mockResolvedValue(accountTypeRoles);
    const accessRole1 = new AccessRoleEntity({ name: 'r1', description: 'lorem', accessRightsIds: ['1'] });
    const accessRole2 = new AccessRoleEntity({ name: 'r2', description: 'lorem', accessRightsIds: ['2'] });
    accessRoleRepo.listByIds.mockResolvedValue({ payload: [accessRole1, accessRole2] });

    const result = await usecase.perform('12345', { accessRolesIds: ['r1', 'r2'] });

    expect(accountTypeRolesRepo.update).toBeCalledWith({ filter: { id: '12345' } }, { accessRolesIds: ['r1', 'r2'] });
    expect(result).toEqual(accountTypeRoles);
    expect(accessRoleRepo.listByIds).toBeCalledWith(['r1', 'r2']);
  });
});
