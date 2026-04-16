import { inject, injectable } from 'inversify';
import { ItemTradeEntity } from '@kwokka/entities';
import { Usecase, UsecaseListResult } from '@kwokka/common-node';
import { ItemTradeRepository } from '../ports';

@injectable()
export class ListItemTradesUsecase implements Usecase {
  public constructor(@inject(ItemTradeRepository) private itemTradeRepository: ItemTradeRepository) {}

  public async perform(offset: number, limit: number): Promise<UsecaseListResult<ItemTradeEntity>> {
    return await this.itemTradeRepository.list({ offset, limit });
  }
}
