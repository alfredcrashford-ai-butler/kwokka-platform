import { UsecaseException } from '@kwokka/common-node';
import { ExceptionCode } from '../exception-code';
import { AccountRepository } from '../ports/account.repository';

export class AccountUsecaseValidations {
  public static async validateAccountExists(repo: AccountRepository, id: string): Promise<void> {
    const account = await repo.find({ filter: { id } });
    if (!account) {
      throw new UsecaseException(ExceptionCode.AccountDoesNotExist, `Account with id: ${id}] does not exist.`);
    }
  }
}
