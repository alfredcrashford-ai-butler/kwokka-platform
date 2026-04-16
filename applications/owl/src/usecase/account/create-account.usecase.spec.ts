import { AccountEntity, AccountEntityType } from '@kwokka/entities';
import { AccountMockRepository } from '../../../test/mocks/account-mock.repository';
import { CreateAccountUsecase } from './create-account.usecase';

describe(CreateAccountUsecase, () => {
  let usecase: CreateAccountUsecase;
  let repo: AccountMockRepository;

  beforeEach(() => {
    repo = new AccountMockRepository();
    usecase = new CreateAccountUsecase(repo);
  });

  it('exists', () => {
    expect(usecase).toBeTruthy();
  });

  it('creates account and stores it', async () => {
    const account = new AccountEntity({ id: '12345', type: AccountEntityType.User, isActive: true, isVerified: true });
    repo.create.mockResolvedValue(account);

    const result = await usecase.perform(account);

    expect(repo.create).toBeCalled();
    expect(result).toEqual(account);
  });
});
