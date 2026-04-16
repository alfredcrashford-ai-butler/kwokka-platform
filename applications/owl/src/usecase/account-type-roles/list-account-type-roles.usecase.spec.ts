import { AccountEntityType, AccountTypeRolesEntity } from '@kwokka/entities';
import { AccountTypeRolesMockRepository } from '../../../test/mocks/account-type-roles-mock.repository';
import { ListAccountTypeRolesUsecase } from './list-account-type-roles.usecase';

describe(ListAccountTypeRolesUsecase, () => {
  let usecase: ListAccountTypeRolesUsecase;
  let repo: AccountTypeRolesMockRepository;

  beforeEach(() => {
    repo = new AccountTypeRolesMockRepository();
    usecase = new ListAccountTypeRolesUsecase(repo);
  });

  it('exists', () => {
    expect(usecase).toBeTruthy();
  });

  it('returns list of account type roles using the repo', async () => {
    const accTypeRoles1 = new AccountTypeRolesEntity({ type: AccountEntityType.User, accessRolesIds: ['r1'] });
    const accTypeRoles2 = new AccountTypeRolesEntity({ type: AccountEntityType.Application, accessRolesIds: ['r2'] });
    repo.list.mockResolvedValue({ payload: [accTypeRoles1, accTypeRoles2] });

    const result = await usecase.perform(0, 50);

    expect(result.payload).toEqual([accTypeRoles1, accTypeRoles2]);
  });
});
