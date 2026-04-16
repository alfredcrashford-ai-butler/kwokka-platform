import { inject, injectable } from 'inversify';
import { CredentialEntity } from '@kwokka/entities';
import { Usecase } from '@kwokka/common-node';
import { CredentialRepository } from '../ports/credential.repository';
import { CredentialUsecaseValidations } from './credential-usecase-validations';

@injectable()
export class UpdateCredentialUsecase implements Usecase {
  public constructor(@inject(CredentialRepository) private credentialRepository: CredentialRepository) {}

  public async perform(id: string, credential: Partial<CredentialEntity>): Promise<CredentialEntity> {
    CredentialUsecaseValidations.validateUpdateFields(credential);
    await CredentialUsecaseValidations.validateExists(this.credentialRepository, id);

    return await this.credentialRepository.update({ filter: { id } }, credential);
  }
}
