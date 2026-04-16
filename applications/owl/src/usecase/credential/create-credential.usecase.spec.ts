import { CredentialEntityType, AnonymousCredentialEntity, CredentialEntity } from '@kwokka/entities';
import { CredentialMockRepository } from '../../../test/mocks/credential-mock.repository';
import { UsecaseException } from '@kwokka/common-node';
import { EmailPasswordCredentialEntity } from '../../entity/credential.entity';
import { CreateCredentialUsecase } from './create-credential.usecase';
import { TokenMockRepository } from '../../../test/mocks/token-mock.repository';

describe(CreateCredentialUsecase, () => {
  let usecase: CreateCredentialUsecase;
  let credentialRepo: CredentialMockRepository;
  let tokenRepo: TokenMockRepository;

  beforeEach(() => {
    credentialRepo = new CredentialMockRepository();
    tokenRepo = new TokenMockRepository();
    usecase = new CreateCredentialUsecase(credentialRepo, tokenRepo);
  });

  it('exists', () => {
    expect(usecase).toBeTruthy();
  });

  it('throws UsecaseException when trying to create anon credential for account with other credentials', async () => {
    const existingCredential = new EmailPasswordCredentialEntity({
      accountId: '12345',
      identifier: 'email@example.com',
      data: { email: 'email@example.com', password: '...' },
      isVerified: false,
    });
    credentialRepo.find.mockResolvedValue(existingCredential);
    const credential = new AnonymousCredentialEntity({
      accountId: '12345',
      identifier: '12345',
      data: { accountId: '12345' },
      isVerified: false,
    });

    await expect(usecase.perform(credential)).rejects.toBeInstanceOf(UsecaseException);
  });

  it('throws UsecaseException when trying to create credential with already existing identifier', async () => {
    const existingCredential = new EmailPasswordCredentialEntity({
      accountId: '22222',
      identifier: 'email@example.com',
      data: { email: 'email@example.com', password: '...' },
      isVerified: false,
    });
    credentialRepo.find.mockResolvedValue(existingCredential);
    const credential = new EmailPasswordCredentialEntity({
      accountId: '11111',
      identifier: 'email@example.com',
      data: { email: 'email@example.com', password: '...' },
      isVerified: false,
    });

    await expect(usecase.perform(credential)).rejects.toBeInstanceOf(UsecaseException);
  });

  it('creates credential and stores it, deletes the old anon credential and its tokens', async () => {
    const accountId = '11111';
    credentialRepo.create.mockImplementation(async (cred) => cred);
    credentialRepo.delete.mockResolvedValue(
      new CredentialEntity({
        type: CredentialEntityType.Anonymous,
        data: {},
        accountId,
        identifier: accountId,
        isVerified: false,
      }),
    );
    const credential = new EmailPasswordCredentialEntity({
      accountId,
      identifier: 'email@example.com',
      data: { email: 'email@example.com', password: '...' },
      isVerified: false,
    });

    const result = await usecase.perform(credential);

    expect(result.identifier).toEqual(credential.identifier);
    expect(credentialRepo.create).toBeCalledWith(credential);
    expect(credentialRepo.delete).toBeCalledWith({ filter: { accountId, type: CredentialEntityType.Anonymous } });
    expect(tokenRepo.deleteMany).toBeCalledWith({ filter: { accountId, credentialId: credential.id } });
  });
});
