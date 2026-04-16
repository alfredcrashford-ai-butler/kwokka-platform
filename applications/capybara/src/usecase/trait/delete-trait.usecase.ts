import { inject, injectable } from 'inversify';
import { Usecase } from '@kwokka/common-node';
import { TraitEntity } from '@kwokka/entities';
import { TraitRepository } from '../ports';
import { TraitUsecaseValidations } from './trait-usecase-validations';

@injectable()
export class DeleteTraitUsecase implements Usecase {
  public constructor(@inject(TraitRepository) private traitRepository: TraitRepository) {}

  public async perform(id: string): Promise<TraitEntity> {
    await TraitUsecaseValidations.validateExists(this.traitRepository, id);

    return await this.traitRepository.delete({ filter: { id } });
  }
}
