import { inject, injectable } from 'inversify';
import { Usecase } from '@kwokka/common-node';
import { TraitEntity, TraitInstanceEntity } from '@kwokka/entities';
import { TraitInstanceRepository } from '../ports';

@injectable()
export class GetTraitInstanceUsecase implements Usecase {
  public constructor(@inject(TraitInstanceRepository) private traitInstanceRepository: TraitInstanceRepository) {}

  public async perform(accountId: string, trait: TraitEntity): Promise<TraitInstanceEntity> {
    let traitInstance = await this.traitInstanceRepository.find({ filter: { accountId, traitId: trait.id } });

    if (!traitInstance) {
      traitInstance = await this.traitInstanceRepository.create({
        accountId,
        traitId: trait.id,
        value: trait.defaultValue,
      });
    }

    return traitInstance;
  }
}
