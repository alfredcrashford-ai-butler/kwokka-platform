import { CredentialEntity, CredentialEntityType } from '@kwokka/entities';
import { UsecaseException } from '@kwokka/common-node';
import { ExceptionCode } from '../exception-code';
import { CredentialRepository } from '../ports/credential.repository';

export class CredentialUsecaseValidations {
  public static async validateAnonymousCredential(
    repo: CredentialRepository,
    credential: CredentialEntity,
  ): Promise<void> {
    if (credential.type !== CredentialEntityType.Anonymous) {
      return;
    }

    const existingCredential = await repo.find({ filter: { accountId: credential.accountId } });
    if (existingCredential) {
      throw new UsecaseException(
        ExceptionCode.AnonymousCredentialsUnallowedWithOtherCredentials,
        'Anonymous credentials can not be created, if an account has any other active credential.',
      );
    }
  }

  public static async validateExistingCredential(
    repo: CredentialRepository,
    credential: CredentialEntity,
  ): Promise<void> {
    const existingCredential = await repo.find({ filter: { identifier: credential.identifier } });
    if (existingCredential) {
      throw new UsecaseException(
        ExceptionCode.CredentialIdentifierAlreadyUsed,
        'Provided credential identifier is already used.',
      );
    }
  }

  public static async validateExists(repo: CredentialRepository, id: string): Promise<void> {
    const credential = await repo.find({ filter: { id } });
    if (!credential) {
      throw new UsecaseException(ExceptionCode.CredentialDoesNotExist, `Credential with id: ${id} does not exist.`);
    }
  }

  public static validateUpdateFields(credential: Partial<CredentialEntity>): void {
    if (credential.accountId) {
      throw new UsecaseException(
        ExceptionCode.ChangeOfAccountIdIsNotAllowedOnCredential,
        'Change of accountId on credential is not allowed.',
      );
    }
    if (credential.type) {
      throw new UsecaseException(
        ExceptionCode.ChangeOfTypeIsNotAllowedOnCredential,
        'Change of type on credential is not allowed.',
      );
    }
    if (credential.identifier) {
      throw new UsecaseException(
        ExceptionCode.ChangeOfIdentifierIsNotAllowedOnCredential,
        'Change of identifier on credential is not allowed.',
      );
    }
  }
}
