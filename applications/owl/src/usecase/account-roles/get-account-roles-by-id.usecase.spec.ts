import { AccountRolesEntity } from '@kwokka/entities';
import { AccountRolesMockRepository } from '../../../test/mocks/account-roles-mock.repository';
import { GetAccountRolesByIdUsecase } from './get-account-roles-by-id.usecase';

describe(GetAccountRolesByIdUsecase, () => {
  let usecase: GetAccountRolesByIdUsecase;
  let repo: AccountRolesMockRepository;

  beforeEach(() => {
    repo = new AccountRolesMockRepository();
    usecase = new GetAccountRolesByIdUsecase(repo);
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

    const result = await usecase.perform(accountRoles.id);

    expect(repo.find).toBeCalledWith({ filter: { id: accountRoles.id } });
    expect(result).toEqual(accountRoles);
  });
});
