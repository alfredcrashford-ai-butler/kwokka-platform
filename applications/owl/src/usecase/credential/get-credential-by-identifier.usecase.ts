import { inject, injectable } from 'inversify';
import { CredentialEntity } from '@kwokka/entities';
import { Usecase } from '@kwokka/common-node';
import { CredentialRepository } from '../ports/credential.repository';

@injectable()
export class GetCredentialByIdentifierUsecase implements Usecase {
  public constructor(@inject(CredentialRepository) private credentialRepository: CredentialRepository) {}

  public async perform(identifier: string): Promise<CredentialEntity> {
    const credential = await this.credentialRepository.find({ filter: { identifier } });

    if (!credential) {
      return null;
    }

    return credential;
  }
}
