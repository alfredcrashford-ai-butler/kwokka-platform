import { inject, injectable } from 'inversify';
import { AccountEntity } from '@kwokka/entities';
import { Usecase } from '@kwokka/common-node';
import { AccountRepository } from '../ports/account.repository';
import { AccountUsecaseValidations } from './accout-usecase-validations';
import { AccountRolesRepository } from '../ports/account-roles.repository';
import { CredentialRepository } from '../ports/credential.repository';
import { TokenRepository } from '../ports/token.repository';

@injectable()
export class DeleteAccountUsecase implements Usecase {
  public constructor(
    @inject(AccountRepository) private accountRepository: AccountRepository,
    @inject(AccountRolesRepository) private accountRolesRepository: AccountRolesRepository,
    @inject(CredentialRepository) private credentialRepository: CredentialRepository,
    @inject(TokenRepository) private tokenRepository: TokenRepository,
  ) {}

  public async perform(id: string): Promise<AccountEntity> {
    await AccountUsecaseValidations.validateAccountExists(this.accountRepository, id);
    await this.tokenRepository.deleteMany({ filter: { accountId: id } });
    await this.credentialRepository.deleteMany({ filter: { accountId: id } });
    await this.accountRolesRepository.deleteMany({ filter: { accountId: id } });
    return await this.accountRepository.delete({ filter: { id } });
  }
}
