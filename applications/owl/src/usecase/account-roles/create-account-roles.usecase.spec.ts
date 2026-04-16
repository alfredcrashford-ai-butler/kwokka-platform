import { AccountEntity, AccountEntityType, AccountRolesEntity } from '@kwokka/entities';
import { AccountMockRepository } from '../../../test/mocks/account-mock.repository';
import { CreateAccountRolesUsecase } from './create-account-roles.usecase';
import { AccountRolesMockRepository } from '../../../test/mocks/account-roles-mock.repository';
import { UsecaseException } from '@kwokka/common-node';

describe(CreateAccountRolesUsecase, () => {
  let usecase: CreateAccountRolesUsecase;
  let accountRepo: AccountMockRepository;
  let accountRolesRepo: AccountRolesMockRepository;

  beforeEach(() => {
    accountRepo = new AccountMockRepository();
    accountRolesRepo = new AccountRolesMockRepository();
    usecase = new CreateAccountRolesUsecase(accountRepo, accountRolesRepo);
  });

  it('exists', () => {
    expect(usecase).toBeTruthy();
  });

  it('throws UsecaseException if account can not be found', async () => {
    const accountRoles = new AccountRolesEntity({ id: '12345', accountId: 'acc', accessRoles: [] });
    accountRepo.find.mockResolvedValue(null);

    await expect(usecase.perform(accountRoles)).rejects.toBeInstanceOf(UsecaseException);
  });

  it('creates account roles and stores it', async () => {
    const account = new AccountEntity({ id: '12345', type: AccountEntityType.User, isActive: true, isVerified: true });
    accountRepo.find.mockResolvedValue(account);
    const accountRoles = new AccountRolesEntity({ id: '12345', accountId: 'acc', accessRoles: [] });
    accountRolesRepo.create.mockResolvedValue(accountRoles);

    const result = await usecase.perform(accountRoles);

    expect(accountRolesRepo.create).toBeCalled();
    expect(result).toEqual(accountRoles);
  });
});
