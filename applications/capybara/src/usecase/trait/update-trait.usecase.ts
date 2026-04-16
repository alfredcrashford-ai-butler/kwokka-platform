import { inject, injectable } from 'inversify';
import { Usecase } from '@kwokka/common-node';
import { TraitEntity } from '@kwokka/entities';
import { TraitRepository } from '../ports';
import { TraitUsecaseValidations } from './trait-usecase-validations';

@injectable()
export class UpdateTraitUsecase implements Usecase {
  public constructor(@inject(TraitRepository) private traitRepository: TraitRepository) {}

  public async perform(id: string, trait: Partial<TraitEntity>): Promise<TraitEntity> {
    TraitUsecaseValidations.validateNoApplicationId(trait);
    await TraitUsecaseValidations.validateExists(this.traitRepository, id);
    if (trait.key) {
      await TraitUsecaseValidations.validateUniqueKey(this.traitRepository, trait.key, id);
    }

    return await this.traitRepository.update({ filter: { id } }, trait);
  }
}
