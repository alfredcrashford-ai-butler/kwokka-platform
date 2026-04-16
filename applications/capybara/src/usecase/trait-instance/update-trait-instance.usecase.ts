import { inject, injectable } from 'inversify';
import { Usecase } from '@kwokka/common-node';
import { TraitInstanceEntity } from '@kwokka/entities';
import { TraitInstanceRepository } from '../ports';

@injectable()
export class UpdateTraitInstanceUsecase implements Usecase {
  public constructor(@inject(TraitInstanceRepository) private traitInstanceRepository: TraitInstanceRepository) {}

  public async perform(accountId: string, traitId: string, value: any): Promise<TraitInstanceEntity> {
    const traitInstance = await this.traitInstanceRepository.find({ filter: { accountId, traitId } });

    if (!traitInstance) {
      return await this.traitInstanceRepository.create({ accountId, traitId, value });
    }

    return await this.traitInstanceRepository.update({ filter: { traitId, accountId } }, { value });
  }
}
