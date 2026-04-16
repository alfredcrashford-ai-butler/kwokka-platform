import { inject, injectable } from 'inversify';
import { Usecase, UsecaseListResult } from '@kwokka/common-node';
import { TraitEntity } from '@kwokka/entities';
import { TraitRepository } from '../ports';

@injectable()
export class ListTraitsUsecase implements Usecase {
  public constructor(@inject(TraitRepository) private traitRepository: TraitRepository) {}

  public async perform(offset: number, limit: number): Promise<UsecaseListResult<TraitEntity>> {
    return await this.traitRepository.list({ offset, limit });
  }
}
