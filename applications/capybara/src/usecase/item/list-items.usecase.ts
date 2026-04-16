import { inject, injectable } from 'inversify';
import { ItemEntity } from '@kwokka/entities';
import { Usecase, UsecaseListResult } from '@kwokka/common-node';
import { ItemRepository } from '../ports';

export type ListItemsParams = {
  ids?: string[];
  keys?: string[];
  tags?: string[];
  applicationAccountId?: string;
}

@injectable()
export class ListItemsUsecase implements Usecase {
  public constructor(@inject(ItemRepository) private itemRepository: ItemRepository) {}

  public async perform(offset: number, limit: number, params?: ListItemsParams): Promise<UsecaseListResult<ItemEntity>> {
    const filter: any = {};
    if (params.applicationAccountId) {
      filter.applicationAccountId = params.applicationAccountId;
    }
    if (params.tags) {
      filter.tags = params.tags;
    }
    if (params.ids) {
      filter.ids = params.ids;
    }
    if (params.keys) {
      filter.keys = params.keys;
    }
    return await this.itemRepository.list({ offset, limit, filter });
  }
}
