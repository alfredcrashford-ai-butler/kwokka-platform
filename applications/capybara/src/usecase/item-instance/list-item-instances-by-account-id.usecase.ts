import { inject, injectable } from 'inversify';
import { ItemInstanceEntity } from '@kwokka/entities';
import { Usecase, UsecaseListResult, RepositoryFilter } from '@kwokka/common-node';
import { ItemInstanceRepository } from '../ports';

@injectable()
export class ListItemInstancesUsecase implements Usecase {
  public constructor(@inject(ItemInstanceRepository) private itemInstanceRepository: ItemInstanceRepository) {}

  public async perform(
    offset: number,
    limit: number,
    accountId?: string,
  ): Promise<UsecaseListResult<ItemInstanceEntity>> {
    const filter: RepositoryFilter = {};

    if (accountId) {
      filter.accountId = accountId;
    }

    return await this.itemInstanceRepository.list({ offset, limit, filter });
  }
}
