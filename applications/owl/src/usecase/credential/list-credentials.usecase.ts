import { inject, injectable } from 'inversify';
import { CredentialEntity } from '@kwokka/entities';
import { Usecase, UsecaseListResult } from '@kwokka/common-node';
import { CredentialRepository } from '../ports/credential.repository';

@injectable()
export class ListCredentialsUsecase implements Usecase {
  public constructor(@inject(CredentialRepository) private credentialRepository: CredentialRepository) {}

  public async perform(offset: number, limit: number): Promise<UsecaseListResult<CredentialEntity>> {
    return await this.credentialRepository.list({ offset, limit });
  }
}
