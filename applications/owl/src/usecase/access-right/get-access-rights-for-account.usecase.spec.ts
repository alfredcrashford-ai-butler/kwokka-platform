import {
  AccessRightEntity,
  AccessRoleEntity,
  AccountEntity,
  AccountEntityType,
  AccountRolesEntity,
  AccountTypeRolesEntity,
} from '@kwokka/entities';
import { AccessRightMockRepository } from '../../../test/mocks/access-right-mock.repository';
import { AccountRolesMockRepository } from '../../../test/mocks/account-roles-mock.repository';
import { AccountTypeRolesMockRepository } from '../../../test/mocks/account-type-roles-mock.repository';
import { GetAccessRightsForAccountUsecase } from './get-access-rights-for-account.usecase';
import { AccessRoleMockRepository } from '../../../test/mocks/access-role-mock.repository';

describe(GetAccessRightsForAccountUsecase, () => {
  let usecase: GetAccessRightsForAccountUsecase;
  let accessRightRepo: AccessRightMockRepository;
  let accessRoleRepo: AccessRoleMockRepository;
  let accountRolesRepo: AccountRolesMockRepository;
  let accountTypeRolesRepo: AccountTypeRolesMockRepository;

  beforeEach(() => {
    accessRightRepo = new AccessRightMockRepository();
    accessRoleRepo = new AccessRoleMockRepository();
    accountRolesRepo = new AccountRolesMockRepository();
    accountTypeRolesRepo = new AccountTypeRolesMockRepository();
    usecase = new GetAccessRightsForAccountUsecase(
      accessRightRepo,
      accountRolesRepo,
      accountTypeRolesRepo,
      accessRoleRepo,
    );
  });

  it('exists', () => {
    expect(usecase).toBeTruthy();
  });

  it('returns all access rights from account type roles if there are no overrides in account roles', async () => {
    const accessRight1Id = 'access_right_1';
    const accessRight1 = new AccessRightEntity({ id: accessRight1Id, name: 'AccessRight1' });
    const accessRight2Id = 'access_right_2';
    const accessRight2 = new AccessRightEntity({ id: accessRight2Id, name: 'AccessRight2' });
    const accessRole1Id = 'access_role_1';
    const accessRole1 = new AccessRoleEntity({
      id: accessRole1Id,
      name: 'Role1',
      description: 'lorem',
      accessRightsIds: [accessRight1Id],
    });
    const accessRole2Id = 'access_role_2';
    const accessRole2 = new AccessRoleEntity({
      id: accessRole2Id,
      name: 'Role2',
      description: 'lorem',
      accessRightsIds: [accessRight2Id],
    });
    const accountTypeRoles = new AccountTypeRolesEntity({
      id: '12345',
      type: AccountEntityType.User,
      accessRolesIds: [accessRole1Id, accessRole2Id],
    });
    const account = new AccountEntity({ id: '12345', type: AccountEntityType.User, isActive: true, isVerified: true });
    accountTypeRolesRepo.find.mockResolvedValue(accountTypeRoles);
    accessRoleRepo.listByIds.mockResolvedValue({ payload: [accessRole1, accessRole2] });
    accessRightRepo.listByIds.mockResolvedValue({ payload: [accessRight1, accessRight2] });

    const result = await usecase.perform(account);

    expect(accountTypeRolesRepo.find).toBeCalled();
    expect(result).toEqual([accessRight1, accessRight2]);
    expect(accessRightRepo.listByIds).toBeCalledWith([accessRight1Id, accessRight2Id]);
    expect(accessRoleRepo.listByIds).toBeCalledWith([accessRole1Id, accessRole2Id]);
  });

  it('returns access rights with overrides when there are some', async () => {
    const accessRight1Id = 'access_right_1';
    const accessRight2Id = 'access_right_2';
    const accessRight2 = new AccessRightEntity({ id: accessRight2Id, name: 'AccessRight2' });
    const accessRight3Id = 'access_right_3';
    const accessRight3 = new AccessRightEntity({ id: accessRight3Id, name: 'AccessRight3' });
    const accessRole1Id = 'access_role_1';
    const accessRole2Id = 'access_role_2';
    const accessRole2 = new AccessRoleEntity({
      id: accessRole2Id,
      name: 'Role2',
      description: 'lorem',
      accessRightsIds: [accessRight2Id],
    });
    const accessRole3Id = 'access_role_3';
    const accessRole3 = new AccessRoleEntity({
      id: accessRole3Id,
      name: 'Role3',
      description: 'lorem',
      accessRightsIds: [accessRight3Id],
    });
    const accountTypeRoles = new AccountTypeRolesEntity({
      id: '12345',
      type: AccountEntityType.User,
      accessRolesIds: [accessRole1Id, accessRole2Id],
    });
    const account = new AccountEntity({ id: '12345', type: AccountEntityType.User, isActive: true, isVerified: true });
    const accountRoles = new AccountRolesEntity({
      id: '12345',
      accountId: '12345',
      accessRoles: [
        { id: accessRole1Id, enabled: false },
        { id: accessRole3Id, enabled: true },
      ],
    });
    accountTypeRolesRepo.find.mockResolvedValue(accountTypeRoles);
    accountRolesRepo.find.mockResolvedValue(accountRoles);
    accessRoleRepo.listByIds.mockResolvedValue({ payload: [accessRole2, accessRole3] });
    accessRightRepo.listByIds.mockResolvedValue({ payload: [accessRight2, accessRight3] });

    const result = await usecase.perform(account);

    expect(accountTypeRolesRepo.find).toBeCalled();
    expect(result).toEqual([accessRight2, accessRight3]);
    expect(accessRightRepo.listByIds).toBeCalledWith([accessRight2Id, accessRight3Id]);
    expect(accessRoleRepo.listByIds).toBeCalledWith([accessRole2Id, accessRole3Id]);
  });
});
