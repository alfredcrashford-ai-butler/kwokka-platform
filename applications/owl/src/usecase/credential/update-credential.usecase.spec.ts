import { CredentialEntityType } from '@kwokka/entities';
import { CredentialMockRepository } from '../../../test/mocks/credential-mock.repository';
import { UsecaseException } from '@kwokka/common-node';
import { EmailPasswordCredentialEntity } from '../../entity/credential.entity';
import { UpdateCredentialUsecase } from './update-credential.usecase';

describe(UpdateCredentialUsecase, () => {
  let usecase: UpdateCredentialUsecase;
  let repo: CredentialMockRepository;

  beforeEach(() => {
    repo = new CredentialMockRepository();
    usecase = new UpdateCredentialUsecase(repo);
  });

  it('exists', () => {
    expect(usecase).toBeTruthy();
  });

  it('throws UsecaseException when updating accountId', async () => {
    await expect(usecase.perform('cred', { accountId: '1235' })).rejects.toBeInstanceOf(UsecaseException);
  });

  it('throws UsecaseException when updating type', async () => {
    await expect(usecase.perform('cred', { type: CredentialEntityType.Google })).rejects.toBeInstanceOf(
      UsecaseException,
    );
  });

  it('throws UsecaseException when updating identifier', async () => {
    await expect(usecase.perform('cred', { identifier: '1235' })).rejects.toBeInstanceOf(UsecaseException);
  });

  it('throws UsecaseException if credential could not be found', async () => {
    repo.find.mockResolvedValue(null);

    await expect(usecase.perform('cred', { isVerified: true })).rejects.toBeInstanceOf(UsecaseException);
  });

  it('updates credential and stores it using repo', async () => {
    const credential = new EmailPasswordCredentialEntity({
      accountId: '11111',
      identifier: 'email@example.com',
      data: { email: 'email@example.com', password: '...' },
      isVerified: false,
    });
    repo.find.mockResolvedValue(credential);
    repo.update.mockResolvedValue(credential);

    const result = await usecase.perform('cred', { isVerified: true });

    expect(result).toEqual(credential);
    expect(repo.update).toBeCalledWith({ filter: { id: 'cred' } }, { isVerified: true });
  });
});
