import { UsecaseException } from '@kwokka/common-node';
import { TraitEntity } from '@kwokka/entities';
import { ExceptionCode } from '../exception-code';
import { TraitRepository } from '../ports';

export class TraitUsecaseValidations {
  public static async validateExists(repo: TraitRepository, id: string): Promise<void> {
    const lobby = await repo.find({ filter: { id } });
    if (!lobby) {
      throw new UsecaseException(ExceptionCode.TraitDoesNotExist, `Trait does not exist: ${id}`);
    }
  }

  public static validateNoApplicationId(trait: Partial<TraitEntity>): void {
    if (trait.applicationAccountId) {
      throw new UsecaseException(
        ExceptionCode.UpdateOfApplicationAccountIdInTraitNotAllowed,
        'Application account id is not allowed',
      );
    }
  }

  public static async validateUniqueKey(repo: TraitRepository, key: string, id?: string): Promise<void> {
    const filter: any = { key };
    if (id) {
      filter.id = { $ne: id };
    }
    const game = await repo.find({ filter });
    if (game) {
      throw new UsecaseException(ExceptionCode.TraitKeyIsAlreadyTaken, `Trait key is already taken: ${key}`);
    }
  }
}
