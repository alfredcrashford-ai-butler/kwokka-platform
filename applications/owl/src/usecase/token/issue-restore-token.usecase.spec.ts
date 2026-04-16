import { AccountEntity, AccountEntityType, RestoreTokenEntity } from '@kwokka/entities';
import { TokenMockRepository } from '../../../test/mocks/token-mock.repository';
import { IssueRestoreTokenUsecase } from './issue-restore-token.usecase';
import { EmailPasswordCredentialEntity } from '../../entity';

describe(IssueRestoreTokenUsecase, () => {
  let usecase: IssueRestoreTokenUsecase;
  let repo: TokenMockRepository;

  beforeEach(() => {
    repo = new TokenMockRepository();
    usecase = new IssueRestoreTokenUsecase(repo);
  });

  it('exists', () => {
    expect(usecase).toBeTruthy();
  });

  it('returns restore token using repo', async () => {
    const account = new AccountEntity({ id: 'acc', type: AccountEntityType.User, isActive: true, isVerified: true });
    const credential = new EmailPasswordCredentialEntity({
      id: 'cred',
      accountId: account.id,
      identifier: 'test@example.com',
      data: { password: '*****', email: 'test@example.com' },
      isVerified: false,
    });
    repo.create.mockImplementation(async (token) => token);

    const result = await usecase.perform(account, credential, { email: credential.data.email, accountId: account.id });

    expect(result).toBeInstanceOf(RestoreTokenEntity);
    expect(result.accountId).toEqual(account.id);
    expect(result.correlationId).toBeTruthy();
    expect(result.credentialId).toEqual(credential.id);
  });
});
