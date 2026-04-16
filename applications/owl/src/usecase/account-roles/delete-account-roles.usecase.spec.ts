import { AccountRolesEntity } from '@kwokka/entities';
import { AccountRolesMockRepository } from '../../../test/mocks/account-roles-mock.repository';
import { UsecaseException } from '@kwokka/common-node';
import { DeleteAccountRolesUsecase } from './delete-account-roles.usecase';

describe(DeleteAccountRolesUsecase, () => {
  let usecase: DeleteAccountRolesUsecase;
  let repo: AccountRolesMockRepository;

  beforeEach(() => {
    repo = new AccountRolesMockRepository();
    usecase = new DeleteAccountRolesUsecase(repo);
  });

  it('exists', () => {
    expect(usecase).toBeTruthy();
  });

  it('throws UsecaseException if account roles can not be found', async () => {
    repo.find.mockResolvedValue(null);

    await expect(usecase.perform('accountRoles')).rejects.toBeInstanceOf(UsecaseException);
  });

  it('deletes account roles using repo method', async () => {
    const accountRoles = new AccountRolesEntity({ id: 'accountRoles', accountId: 'acc', accessRoles: [] });
    repo.find.mockResolvedValue(accountRoles);
    repo.delete.mockResolvedValue(accountRoles);

    const result = await usecase.perform(accountRoles.id);

    expect(repo.delete).toBeCalledWith({ filter: { id: accountRoles.id } });
    expect(result).toEqual(accountRoles);
  });
});
