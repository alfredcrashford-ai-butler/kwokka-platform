import { AccountRolesEntity } from '@kwokka/entities';
import { AccountRolesMockRepository } from '../../../test/mocks/account-roles-mock.repository';
import { UsecaseException } from '@kwokka/common-node';
import { UpdateAccountRolesUsecase } from './update-account-roles.usecase';

describe(UpdateAccountRolesUsecase, () => {
  let usecase: UpdateAccountRolesUsecase;
  let repo: AccountRolesMockRepository;

  beforeEach(() => {
    repo = new AccountRolesMockRepository();
    usecase = new UpdateAccountRolesUsecase(repo);
  });

  it('exists', () => {
    expect(usecase).toBeTruthy();
  });

  it('throws UsecaseException if account roles can not be found', async () => {
    repo.find.mockResolvedValue(null);

    await expect(usecase.perform('accountRoles', { accessRoles: [] })).rejects.toBeInstanceOf(UsecaseException);
  });

  it('updates account roles using repo method', async () => {
    const accountRoles = new AccountRolesEntity({ id: 'accountRoles', accountId: 'acc', accessRoles: [] });
    repo.find.mockResolvedValue(accountRoles);
    repo.update.mockResolvedValue(accountRoles);

    const result = await usecase.perform(accountRoles.id, { accessRoles: [] });

    expect(repo.update).toBeCalledWith({ filter: { id: accountRoles.id } }, { accessRoles: [] });
    expect(result).toEqual(accountRoles);
  });
});
