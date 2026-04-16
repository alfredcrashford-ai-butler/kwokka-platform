import { CredentialMockRepository } from '../../../test/mocks/credential-mock.repository';
import { UsecaseException } from '@kwokka/common-node';
import { EmailPasswordCredentialEntity } from '../../entity/credential.entity';
import { DeleteCredentialUsecase } from './delete-credential.usecase';
import { TokenMockRepository } from '../../../test/mocks/token-mock.repository';

describe(DeleteCredentialUsecase, () => {
  let usecase: DeleteCredentialUsecase;
  let credentialRepo: CredentialMockRepository;
  let tokenRepo: TokenMockRepository;

  beforeEach(() => {
    credentialRepo = new CredentialMockRepository();
    tokenRepo = new TokenMockRepository();
    usecase = new DeleteCredentialUsecase(credentialRepo, tokenRepo);
  });

  it('exists', () => {
    expect(usecase).toBeTruthy();
  });

  it('throws UsecaseException if credential could not be found', async () => {
    credentialRepo.find.mockResolvedValue(null);

    await expect(usecase.perform('cred')).rejects.toBeInstanceOf(UsecaseException);
  });

  it('deletes credential and all its tokens', async () => {
    const credential = new EmailPasswordCredentialEntity({
      accountId: '11111',
      identifier: 'email@example.com',
      data: { email: 'email@example.com', password: '...' },
      isVerified: false,
    });
    credentialRepo.find.mockResolvedValue(credential);

    await usecase.perform('cred');

    expect(credentialRepo.delete).toBeCalledWith({ filter: { id: 'cred' } });
    expect(tokenRepo.deleteMany).toBeCalledWith({ filter: { credentialId: 'cred' } });
  });
});
