import { inject, injectable } from 'inversify';
import { Usecase } from '@kwokka/common-node';
import { TraitEntity } from '@kwokka/entities';
import { TraitRepository } from '../ports';

@injectable()
export class GetTraitByIdUsecase implements Usecase {
  public constructor(@inject(TraitRepository) private traitRepository: TraitRepository) {}

  public async perform(id: string): Promise<TraitEntity> {
    const trait = await this.traitRepository.find({ filter: { id } });

    if (!trait) {
      return null;
    }

    return trait;
  }
}
