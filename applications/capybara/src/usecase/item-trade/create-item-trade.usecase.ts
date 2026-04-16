import { inject, injectable } from 'inversify';
import { ItemTradeEntity } from '@kwokka/entities';
import { Usecase } from '@kwokka/common-node';
import { ItemRepository, ItemTradeRepository } from '../ports';
import { ItemTradeUsecaseValidations } from './item-trade-usecase-validations';

@injectable()
export class CreateItemTradeUsecase implements Usecase {
  public constructor(
    @inject(ItemTradeRepository) private itemTradeRepository: ItemTradeRepository,
    @inject(ItemRepository) private itemRepository: ItemRepository,
  ) {}

  public async perform(itemTrade: ItemTradeEntity): Promise<ItemTradeEntity> {
    itemTrade.key = itemTrade.key.trim();
    ItemTradeUsecaseValidations.validateQuantity(itemTrade);
    await ItemTradeUsecaseValidations.validateUniqueKey(this.itemTradeRepository, itemTrade.key);
    await ItemTradeUsecaseValidations.validateItemExists(this.itemRepository, itemTrade.itemId);
    await ItemTradeUsecaseValidations.validateItemExists(this.itemRepository, itemTrade.tradedItemId);
    await ItemTradeUsecaseValidations.validateRequiredItems(this.itemRepository, itemTrade);

    return await this.itemTradeRepository.create(itemTrade);
  }
}
