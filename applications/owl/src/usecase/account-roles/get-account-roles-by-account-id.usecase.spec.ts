import { AccountRolesEntity } from '@kwokka/entities';
import { AccountRolesMockRepository } from '../../../test/mocks/account-roles-mock.repository';
import { GetAccountRolesByAccountIdUsecase } from './get-account-roles-by-account-id.usecase';

describe(GetAccountRolesByAccountIdUsecase, () => {
  let usecase: GetAccountRolesByAccountIdUsecase;
  let repo: AccountRolesMockRepository;

  beforeEach(() => {
    repo = new AccountRolesMockRepository();
    usecase = new GetAccountRolesByAccountIdUsecase(repo);
  });

  it('exists', () => {
    expect(usecase).toBeTruthy();
  });

  it('returns null if account roles can not be found', async () => {
    repo.find.mockResolvedValue(null);

    const result = await usecase.perform('accountRoles');

    expect(result).toEqual(null);
  });

  it('returns account roles from repo', async () => {
    const accountRoles = new AccountRolesEntity({ id: 'accountRoles', accountId: 'acc', accessRoles: [] });
    repo.find.mockResolvedValue(accountRoles);

    const result = await usecase.perform(accountRoles.accountId);

    expect(repo.find).toBeCalledWith({ filter: { accountId: accountRoles.accountId } });
    expect(result).toEqual(accountRoles);
  });
});
