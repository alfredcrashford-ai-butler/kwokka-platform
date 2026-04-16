import { AccountEntity, AccountEntityType } from '@kwokka/entities';
import { AccountMockRepository } from '../../../test/mocks/account-mock.repository';
import { DeleteAccountUsecase } from './delete-account.usecase';
import { CredentialMockRepository } from '../../../test/mocks/credential-mock.repository';
import { AccountRolesMockRepository } from '../../../test/mocks/account-roles-mock.repository';
import { TokenMockRepository } from '../../../test/mocks/token-mock.repository';
import { UsecaseException } from '@kwokka/common-node';

describe(DeleteAccountUsecase, () => {
  let usecase: DeleteAccountUsecase;
  let accountRepo: AccountMockRepository;
  let accountRolesRepo: AccountRolesMockRepository;
  let credentialRepo: CredentialMockRepository;
  let tokenRepo: TokenMockRepository;

  beforeEach(() => {
    accountRepo = new AccountMockRepository();
    accountRolesRepo = new AccountRolesMockRepository();
    credentialRepo = new CredentialMockRepository();
    tokenRepo = new TokenMockRepository();
    usecase = new DeleteAccountUsecase(accountRepo, accountRolesRepo, credentialRepo, tokenRepo);
  });

  it('exists', () => {
    expect(usecase).toBeTruthy();
  });

  it('throws UsecaseException if account does not exist account and stores it', async () => {
    accountRepo.find.mockResolvedValue(null);

    await expect(usecase.perform('12345')).rejects.toBeInstanceOf(UsecaseException);
  });

  it('deletes account, account roles, credentials, and tokens', async () => {
    const account = new AccountEntity({ id: '12345', type: AccountEntityType.User, isActive: true, isVerified: true });
    accountRepo.find.mockResolvedValue(account);
    accountRepo.delete.mockResolvedValue(account);

    const result = await usecase.perform('12345');

    expect(accountRepo.delete).toBeCalled();
    expect(accountRolesRepo.deleteMany).toBeCalledWith({ filter: { accountId: '12345' } });
    expect(credentialRepo.deleteMany).toBeCalledWith({ filter: { accountId: '12345' } });
    expect(tokenRepo.deleteMany).toBeCalledWith({ filter: { accountId: '12345' } });
    expect(result).toEqual(account);
  });
});
