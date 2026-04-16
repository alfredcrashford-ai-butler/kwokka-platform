import { AccountEntity, AccountEntityType } from '@kwokka/entities';
import { AccountMockRepository } from '../../../test/mocks/account-mock.repository';
import { ListAccountsUsecase } from './list-accounts.usecase';

describe(ListAccountsUsecase, () => {
  let usecase: ListAccountsUsecase;
  let repo: AccountMockRepository;

  beforeEach(() => {
    repo = new AccountMockRepository();
    usecase = new ListAccountsUsecase(repo);
  });

  it('exists', () => {
    expect(usecase).toBeTruthy();
  });

  it('lists account using repo method', async () => {
    const account1 = new AccountEntity({ id: 'acc_1', type: AccountEntityType.User, isActive: true, isVerified: true });
    const account2 = new AccountEntity({ id: 'acc_2', type: AccountEntityType.User, isActive: true, isVerified: true });
    repo.list.mockResolvedValue({ payload: [account1, account2] });

    const result = await usecase.perform(0, 50);

    expect(repo.list).toBeCalled();
    expect(result.payload).toEqual([account1, account2]);
  });
});
