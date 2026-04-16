import { VerifyTokenEntity } from '@kwokka/entities';
import { TokenMockRepository } from '../../../test/mocks/token-mock.repository';
import { EmailPasswordCredentialEntity } from '../../entity';
import { IssueVerifyTokenUsecase } from './issue-verify-token.usecase';

describe(IssueVerifyTokenUsecase, () => {
  let usecase: IssueVerifyTokenUsecase;
  let repo: TokenMockRepository;

  beforeEach(() => {
    repo = new TokenMockRepository();
    usecase = new IssueVerifyTokenUsecase(repo);
  });

  it('exists', () => {
    expect(usecase).toBeTruthy();
  });

  it('returns verify token using repo', async () => {
    const accountId = 'acc';
    const credential = new EmailPasswordCredentialEntity({
      id: 'cred',
      accountId,
      identifier: 'test@example.com',
      data: { password: '*****', email: 'test@example.com' },
      isVerified: false,
    });
    repo.create.mockImplementation(async (token) => token);

    const result = await usecase.perform(credential);

    expect(result).toBeInstanceOf(VerifyTokenEntity);
    expect(result.accountId).toEqual(accountId);
    expect(result.correlationId).toBeTruthy();
    expect(result.credentialId).toEqual(credential.id);
    expect(result.content.credentialId).toEqual(credential.id);
  });
});
