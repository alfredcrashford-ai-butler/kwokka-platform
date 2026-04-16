import { inject, injectable } from 'inversify';
import { CredentialEntity } from '@kwokka/entities';
import { Usecase } from '@kwokka/common-node';
import { CredentialRepository } from '../ports/credential.repository';

@injectable()
export class GetCredentialByIdUsecase implements Usecase {
  public constructor(@inject(CredentialRepository) private credentialRepository: CredentialRepository) {}

  public async perform(id: string): Promise<CredentialEntity> {
    const credential = await this.credentialRepository.find({ filter: { id } });

    if (!credential) {
      return null;
    }

    return credential;
  }
}
