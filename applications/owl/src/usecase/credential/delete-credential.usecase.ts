import { inject, injectable } from 'inversify';
import { CredentialEntity } from '@kwokka/entities';
import { Usecase } from '@kwokka/common-node';
import { CredentialRepository } from '../ports/credential.repository';
import { CredentialUsecaseValidations } from './credential-usecase-validations';
import { TokenRepository } from '../ports/token.repository';

@injectable()
export class DeleteCredentialUsecase implements Usecase {
  public constructor(
    @inject(CredentialRepository) private credentialRepository: CredentialRepository,
    @inject(TokenRepository) private tokenRepository: TokenRepository,
  ) {}

  public async perform(id: string): Promise<CredentialEntity> {
    await CredentialUsecaseValidations.validateExists(this.credentialRepository, id);

    const credential = await this.credentialRepository.delete({ filter: { id } });

    await this.tokenRepository.deleteMany({ filter: { credentialId: id } });

    return credential;
  }
}
