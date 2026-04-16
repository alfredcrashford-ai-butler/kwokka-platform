import { AccountEntityType, AccountTypeRolesEntity } from '@kwokka/entities';
import { AccountTypeRolesMockRepository } from '../../../test/mocks/account-type-roles-mock.repository';
import { GetAccountTypeRolesByIdUsecase } from './get-account-type-roles-by-id.usecase';

describe(GetAccountTypeRolesByIdUsecase, () => {
  let usecase: GetAccountTypeRolesByIdUsecase;
  let repo: AccountTypeRolesMockRepository;

  beforeEach(() => {
    repo = new AccountTypeRolesMockRepository();
    usecase = new GetAccountTypeRolesByIdUsecase(repo);
  });

  it('exists', () => {
    expect(usecase).toBeTruthy();
  });

  it('returns null if account type roles could not be found', async () => {
    repo.find.mockResolvedValue(null);

    const result = await usecase.perform('12345');

    expect(result).toEqual(null);
  });

  it('returns account type roles using the repo', async () => {
    const accountTypeRoles = new AccountTypeRolesEntity({ type: AccountEntityType.User, accessRolesIds: ['r1', 'r2'] });
    repo.find.mockResolvedValue(accountTypeRoles);

    const result = await usecase.perform('12345');

    expect(repo.find).toBeCalledWith({ filter: { id: '12345' } });
    expect(result).toEqual(accountTypeRoles);
  });
});
