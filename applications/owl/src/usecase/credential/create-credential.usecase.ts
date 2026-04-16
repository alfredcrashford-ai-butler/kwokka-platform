import { inject, injectable } from 'inversify';
import { CredentialEntity, CredentialEntityType } from '@kwokka/entities';
import { Usecase } from '@kwokka/common-node';
import { CredentialRepository } from '../ports/credential.repository';
import { CredentialUsecaseValidations } from './credential-usecase-validations';
import { TokenRepository } from '../ports';

@injectable()
export class CreateCredentialUsecase implements Usecase {
  public constructor(
    @inject(CredentialRepository) private credentialRepository: CredentialRepository,
    @inject(TokenRepository) private tokenRepository: TokenRepository,
  ) {}

  public async perform(credential: CredentialEntity): Promise<CredentialEntity> {
    await CredentialUsecaseValidations.validateAnonymousCredential(this.credentialRepository, credential);
    await CredentialUsecaseValidations.validateExistingCredential(this.credentialRepository, credential);

    credential = await this.credentialRepository.create(credential);

    if (credential.type !== CredentialEntityType.Anonymous) {
      const deletedAnonCredential = await this.credentialRepository.delete({
        filter: { accountId: credential.accountId, type: CredentialEntityType.Anonymous },
      });

      if (deletedAnonCredential) {
        await this.tokenRepository.deleteMany({
          filter: { accountId: credential.accountId, credentialId: deletedAnonCredential.id },
        });
      }
    }

    return credential;
  }
}
