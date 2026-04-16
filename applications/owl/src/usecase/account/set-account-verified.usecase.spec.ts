import { AccountEntity, AccountEntityType } from '@kwokka/entities';
import { AccountMockRepository } from '../../../test/mocks/account-mock.repository';
import { UsecaseException } from '@kwokka/common-node';
import { SetAccountVerifiedUsecase } from './set-account-verified.usecase';

describe(SetAccountVerifiedUsecase, () => {
  let usecase: SetAccountVerifiedUsecase;
  let repo: AccountMockRepository;

  beforeEach(() => {
    repo = new AccountMockRepository();
    usecase = new SetAccountVerifiedUsecase(repo);
  });

  it('exists', () => {
    expect(usecase).toBeTruthy();
  });

  it('throws UsecaseException if account does not exist account and stores it', async () => {
    repo.find.mockResolvedValue(null);

    await expect(usecase.perform('12345', true)).rejects.toBeInstanceOf(UsecaseException);
  });

  it('calls repo method to set account verified flag', async () => {
    const account = new AccountEntity({ id: '12345', type: AccountEntityType.User, isActive: true, isVerified: false });
    repo.find.mockResolvedValue(account);

    await usecase.perform('12345', true);

    expect(repo.update).toBeCalledWith({ filter: { id: '12345' } }, { isVerified: true });
  });
});
