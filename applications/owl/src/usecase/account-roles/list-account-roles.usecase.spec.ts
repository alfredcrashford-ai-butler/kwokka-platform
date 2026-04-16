import { AccountRolesEntity } from '@kwokka/entities';
import { AccountRolesMockRepository } from '../../../test/mocks/account-roles-mock.repository';
import { ListAccountRolesUsecase } from './list-account-roles.usecase';

describe(ListAccountRolesUsecase, () => {
  let usecase: ListAccountRolesUsecase;
  let repo: AccountRolesMockRepository;

  beforeEach(() => {
    repo = new AccountRolesMockRepository();
    usecase = new ListAccountRolesUsecase(repo);
  });

  it('exists', () => {
    expect(usecase).toBeTruthy();
  });

  it('returns list of account roles from repo', async () => {
    const accountRoles1 = new AccountRolesEntity({ id: 'accountRoles1', accountId: 'acc1', accessRoles: [] });
    const accountRoles2 = new AccountRolesEntity({ id: 'accountRoles2', accountId: 'acc2', accessRoles: [] });
    repo.list.mockResolvedValue({ payload: [accountRoles1, accountRoles2] });

    const result = await usecase.perform(0, 50);

    expect(repo.list).toBeCalled();
    expect(result.payload).toEqual([accountRoles1, accountRoles2]);
  });
});
