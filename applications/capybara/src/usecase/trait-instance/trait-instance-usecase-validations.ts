import { UsecaseException } from '@kwokka/common-node';
import { TraitInstanceEntity } from '@kwokka/entities';
import { ExceptionCode } from '../exception-code';
import { TraitInstanceRepository, TraitRepository } from '../ports';

export class TraitInstanceUsecaseValidations {
  public static async validateExists(repo: TraitInstanceRepository, id: string): Promise<void> {
    const lobby = await repo.find({ filter: { id } });
    if (!lobby) {
      throw new UsecaseException(ExceptionCode.TraitInstanceDoesNotExist, `Trait instance does not exist: ${id}`);
    }
  }

  public static async validateTraitExists(repo: TraitRepository, id: string): Promise<void> {
    const lobby = await repo.find({ filter: { id } });
    if (!lobby) {
      throw new UsecaseException(ExceptionCode.TraitDoesNotExist, `Trait does not exist: ${id}`);
    }
  }

  public static validateNoAccountId(traitInstance: Partial<TraitInstanceEntity>): void {
    if (traitInstance.accountId) {
      throw new UsecaseException(
        ExceptionCode.UpdateOfAccountIdInTraitInstanceIsNotAllowed,
        'Account id is not allowed',
      );
    }
  }

  public static validateNoTraitId(traitInstance: Partial<TraitInstanceEntity>): void {
    if (traitInstance.traitId) {
      throw new UsecaseException(
        ExceptionCode.UpdateOfTraitIdInTraitInstanceIsNotAllowed,
        'Trait id is not allowed',
      );
    }
  }
}
