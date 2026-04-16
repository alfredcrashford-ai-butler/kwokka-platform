import { inject, injectable } from 'inversify';
import { Usecase } from '@kwokka/common-node';
import { ItemRepository, ItemTradeRepository } from '../ports';
import { ItemTradeEntity } from '@kwokka/entities';
import { ItemTradeUsecaseValidations } from './item-trade-usecase-validations';

@injectable()
export class UpdateItemTradeUsecase implements Usecase {
  public constructor(
    @inject(ItemRepository) private itemRepository: ItemRepository,
    @inject(ItemTradeRepository) private itemTradeRepository: ItemTradeRepository,
  ) {}

  public async perform(id: string, itemTrade: Partial<ItemTradeEntity>): Promise<ItemTradeEntity> {
    const existingItemTrade = await ItemTradeUsecaseValidations.validateExists(this.itemTradeRepository, itemTrade.id);
    if (itemTrade.key) {
      itemTrade.key = itemTrade.key.trim();
      await ItemTradeUsecaseValidations.validateUniqueKey(this.itemTradeRepository, itemTrade.key, id);
    }
    if (itemTrade.tradedItemId) {
      await ItemTradeUsecaseValidations.validateItemExists(this.itemRepository, itemTrade.tradedItemId);
    }
    if (itemTrade.itemId) {
      await ItemTradeUsecaseValidations.validateItemExists(this.itemRepository, itemTrade.itemId);
    }
    if (itemTrade.quantity || itemTrade.tradedItemQuantity || itemTrade.requiredItems || itemTrade.maxQuantity) {
      const quantityItemTrade = new ItemTradeEntity({
        ...existingItemTrade,
        quantity: itemTrade?.quantity ?? existingItemTrade.quantity,
        tradedItemQuantity: itemTrade?.tradedItemQuantity ?? existingItemTrade.tradedItemQuantity,
        maxQuantity: itemTrade?.maxQuantity ?? existingItemTrade.maxQuantity,
        requiredItems: itemTrade?.requiredItems ?? existingItemTrade.requiredItems,
      });
      ItemTradeUsecaseValidations.validateQuantity(quantityItemTrade);
    }
    await ItemTradeUsecaseValidations.validateRequiredItems(this.itemRepository, itemTrade);

    return await this.itemTradeRepository.update({ filter: { id } }, itemTrade);
  }
}
