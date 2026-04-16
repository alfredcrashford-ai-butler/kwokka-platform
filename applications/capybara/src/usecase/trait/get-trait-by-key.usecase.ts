import { inject, injectable } from 'inversify';
import { TraitEntity } from '@kwokka/entities';
import { Usecase } from '@kwokka/common-node';
import { TraitRepository } from '../ports';

@injectable()
export class GetTraitByKeyUsecase implements Usecase {
  public constructor(@inject(TraitRepository) private traitRepository: TraitRepository) {}

  public async perform(key: string): Promise<TraitEntity> {
    const trait = await this.traitRepository.find({ filter: { key } });

    if (!trait) {
      return null;
    }

    return trait;
  }
}
