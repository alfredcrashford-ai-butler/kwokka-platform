import { CredentialMockRepository } from '../../../test/mocks/credential-mock.repository';
import { EmailPasswordCredentialEntity } from '../../entity/credential.entity';
import { ListCredentialsByAccountIdUsecase } from './list-credentials-by-account-id.usecase';

describe(ListCredentialsByAccountIdUsecase, () => {
  let usecase: ListCredentialsByAccountIdUsecase;
  let repo: CredentialMockRepository;

  beforeEach(() => {
    repo = new CredentialMockRepository();
    usecase = new ListCredentialsByAccountIdUsecase(repo);
  });

  it('exists', () => {
    expect(usecase).toBeTruthy();
  });

  it('returns list of credentials using repo', async () => {
    const credential1 = new EmailPasswordCredentialEntity({
      accountId: '1',
      identifier: 'email@example.com',
      data: { email: 'email@example.com', password: '...' },
      isVerified: false,
    });
    const credential2 = new EmailPasswordCredentialEntity({
      accountId: '2',
      identifier: 'email@example.com',
      data: { email: 'email@example.com', password: '...' },
      isVerified: false,
    });
    repo.list.mockResolvedValue({ payload: [credential1, credential2] });

    const result = await usecase.perform('acc', 0, 50);

    expect(result.payload).toEqual([credential1, credential2]);
    expect(repo.list).toBeCalledWith({ filter: { accountId: 'acc' }, limit: 50, offset: 0 });
  });
});
