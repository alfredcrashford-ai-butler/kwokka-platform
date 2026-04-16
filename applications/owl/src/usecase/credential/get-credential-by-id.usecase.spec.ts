import { CredentialMockRepository } from '../../../test/mocks/credential-mock.repository';
import { EmailPasswordCredentialEntity } from '../../entity/credential.entity';
import { GetCredentialByIdUsecase } from './get-credential-by-id.usecase';

describe(GetCredentialByIdUsecase, () => {
  let usecase: GetCredentialByIdUsecase;
  let repo: CredentialMockRepository;

  beforeEach(() => {
    repo = new CredentialMockRepository();
    usecase = new GetCredentialByIdUsecase(repo);
  });

  it('exists', () => {
    expect(usecase).toBeTruthy();
  });

  it('returns null if credential could not be found', async () => {
    repo.find.mockResolvedValue(null);

    const result = await usecase.perform('cred');

    expect(result).toEqual(null);
  });

  it('returns credential using repo', async () => {
    const credential = new EmailPasswordCredentialEntity({
      accountId: '11111',
      identifier: 'email@example.com',
      data: { email: 'email@example.com', password: '...' },
      isVerified: false,
    });
    repo.find.mockResolvedValue(credential);

    const result = await usecase.perform('cred');

    expect(result).toEqual(credential);
    expect(repo.find).toBeCalledWith({ filter: { id: 'cred' } });
  });
});
