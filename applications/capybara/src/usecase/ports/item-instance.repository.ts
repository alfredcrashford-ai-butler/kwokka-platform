import { injectable } from 'inversify';
import { ItemInstanceEntity } from '@kwokka/entities';
import { Repository, RepositoryFilterListParams, RepositoryListResult } from '@kwokka/common-node';

@injectable()
export abstract class ItemInstanceRepository extends Repository<ItemInstanceEntity> {
  public abstract listAll(params: RepositoryFilterListParams): Promise<RepositoryListResult<ItemInstanceEntity[]>>;
  public abstract listByItemsIds(
    itemsIds: string[],
    accountId: string,
  ): Promise<RepositoryListResult<ItemInstanceEntity[]>>;
  public abstract listAllExisting(
    params: RepositoryFilterListParams,
  ): Promise<RepositoryListResult<ItemInstanceEntity[]>>;
}
