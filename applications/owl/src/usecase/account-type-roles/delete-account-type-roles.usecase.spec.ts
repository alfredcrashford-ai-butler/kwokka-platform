import { AccountEntityType, AccountTypeRolesEntity } from '@kwokka/entities';
import { UsecaseException } from '@kwokka/common-node';
import { AccountTypeRolesMockRepository } from '../../../test/mocks/account-type-roles-mock.repository';
import { DeleteAccountTypeRolesUsecase } from './delete-account-type-roles.usecase';

describe(DeleteAccountTypeRolesUsecase, () => {
  let usecase: DeleteAccountTypeRolesUsecase;
  let repo: AccountTypeRolesMockRepository;

  beforeEach(() => {
    repo = new AccountTypeRolesMockRepository();
    usecase = new DeleteAccountTypeRolesUsecase(repo);
  });

  it('exists', () => {
    expect(usecase).toBeTruthy();
  });

  it('throws UsecaseException if account type roles could not be found', async () => {
    repo.find.mockResolvedValue(null);

    await expect(usecase.perform('12345')).rejects.toBeInstanceOf(UsecaseException);
  });

  it('deletes account type roles and stores it', async () => {
    const accountTypeRoles = new AccountTypeRolesEntity({ type: AccountEntityType.User, accessRolesIds: ['r1', 'r2'] });
    repo.find.mockResolvedValue(accountTypeRoles);
    repo.delete.mockResolvedValue(accountTypeRoles);

    const result = await usecase.perform('12345');

    expect(repo.delete).toBeCalledWith({ filter: { id: '12345' } });
    expect(result).toEqual(accountTypeRoles);
  });
});
