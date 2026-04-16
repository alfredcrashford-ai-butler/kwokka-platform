import { AccountEntity, AccountEntityType } from '@kwokka/entities';
import { AccountMockRepository } from '../../../test/mocks/account-mock.repository';
import { GetAccountByIdUsecase } from './get-account-by-id.usecase';

describe(GetAccountByIdUsecase, () => {
  let usecase: GetAccountByIdUsecase;
  let repo: AccountMockRepository;

  beforeEach(() => {
    repo = new AccountMockRepository();
    usecase = new GetAccountByIdUsecase(repo);
  });

  it('exists', () => {
    expect(usecase).toBeTruthy();
  });

  it('returns null if account was not found', async () => {
    repo.find.mockResolvedValue(null);
    const result = await usecase.perform('acc');
    expect(result).toEqual(null);
  });

  it('returns account using repo method', async () => {
    const account = new AccountEntity({ id: 'acc', type: AccountEntityType.User, isActive: true, isVerified: true });
    repo.find.mockResolvedValue(account);

    const result = await usecase.perform('acc');

    expect(result).toEqual(account);
  });
});
