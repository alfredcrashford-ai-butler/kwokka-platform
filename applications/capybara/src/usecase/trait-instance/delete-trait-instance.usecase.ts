import { inject, injectable } from 'inversify';
import { Usecase } from '@kwokka/common-node';
import { TraitInstanceEntity } from '@kwokka/entities';
import { TraitInstanceRepository } from '../ports';

@injectable()
export class DeleteTraitInstanceUsecase implements Usecase {
  public constructor(@inject(TraitInstanceRepository) private traitInstanceRepository: TraitInstanceRepository) {}

  public async perform(accountId: string, traitId: string): Promise<TraitInstanceEntity> {
    return await this.traitInstanceRepository.delete({ filter: { accountId, traitId } });
  }
}
