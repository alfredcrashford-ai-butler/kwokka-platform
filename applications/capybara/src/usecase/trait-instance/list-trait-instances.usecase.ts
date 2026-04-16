import { inject, injectable } from 'inversify';
import { Usecase, UsecaseListResult } from '@kwokka/common-node';
import { TraitInstanceEntity } from '@kwokka/entities';
import { TraitInstanceRepository } from '../ports';

@injectable()
export class ListTraitInstancesUsecase implements Usecase {
  public constructor(@inject(TraitInstanceRepository) private traitInstanceRepository: TraitInstanceRepository) {}

  public async perform(
    filter: { traitId: string },
    sort: Record<string, 'asc' | 'desc'>,
    offset: number,
    limit: number,
  ): Promise<UsecaseListResult<TraitInstanceEntity>> {
    return await this.traitInstanceRepository.list({ filter, sort, offset, limit });
  }
}
