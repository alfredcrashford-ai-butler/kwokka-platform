import { DecorationEntity } from '@kwokka/entities';
import { UsecaseException } from '@kwokka/common-node';
import { ExceptionCode } from '../exception-code';
import { DecorationRepository } from '../ports';

export class DecorationUsecaseValidations {
  public static async validateExists(decorationRepository: DecorationRepository, id: string): Promise<DecorationEntity> {
    const decoration = await decorationRepository.find({ filter: { id } });
    if (!decoration) {
      throw new UsecaseException(ExceptionCode.DecorationDoesNotExist, `Decoration does not exist: ${id}`);
    }

    return decoration;
  }

  public static validateNoApplicationAccountId(decoration: Partial<DecorationEntity>): void {
    if (decoration.applicationAccountId) {
      throw new UsecaseException(
        ExceptionCode.UpdateOfApplicationAccountIdInDecorationNotAllowed,
        'Update of application account id in decoration is not allowed',
      );
    }
  }

  public static async validateUniqueKey(
    decorationRepository: DecorationRepository,
    key: string,
    id?: string,
  ): Promise<void> {
    const filter: any = { key };
    if (id) {
      filter.id = { $ne: id };
    }
    const profile = await decorationRepository.find({ filter });
    if (profile) {
      throw new UsecaseException(ExceptionCode.DecorationKeyIsAlreadyTaken, `Decoration key is already taken: ${key}`);
    }
  }
}
