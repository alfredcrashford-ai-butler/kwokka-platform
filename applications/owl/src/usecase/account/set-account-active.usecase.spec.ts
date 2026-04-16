import { AccountEntity, AccountEntityType } from '@kwokka/entities';
import { AccountMockRepository } from '../../../test/mocks/account-mock.repository';
import { UsecaseException } from '@kwokka/common-node';
import { SetAccountActiveUsecase } from './set-account-active.usecase';

describe(SetAccountActiveUsecase, () => {
  let usecase: SetAccountActiveUsecase;
  let repo: AccountMockRepository;

  beforeEach(() => {
    repo = new AccountMockRepository();
    usecase = new SetAccountActiveUsecase(repo);
  });

  it('exists', () => {
    expect(usecase).toBeTruthy();
  });

  it('throws UsecaseException if account does not exist account and stores it', async () => {
    repo.find.mockResolvedValue(null);

    await expect(usecase.perform('12345', true)).rejects.toBeInstanceOf(UsecaseException);
  });

  it('calls repo method to set account active flag', async () => {
    const account = new AccountEntity({ id: '12345', type: AccountEntityType.User, isActive: false, isVerified: true });
    repo.find.mockResolvedValue(account);

    await usecase.perform('12345', true);

    expect(repo.update).toBeCalledWith({ filter: { id: '12345' } }, { isActive: true });
  });
});
