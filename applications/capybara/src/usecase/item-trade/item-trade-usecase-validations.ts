import { ItemEntity, ItemTradeEntity } from '@kwokka/entities';
import { UsecaseException } from '@kwokka/common-node';
import { ExceptionCode } from '../exception-code';
import { ItemInstanceRepository, ItemRepository, ItemTradeRepository } from '../ports';

export class ItemTradeUsecaseValidations {
  public static async validateItemExists(repo: ItemRepository, id: string): Promise<ItemEntity> {
    const item = await repo.find({ filter: { id } });
    if (!item) {
      throw new UsecaseException(ExceptionCode.ItemDoesNotExist, `Item does not exist, id: ${id}`);
    }

    return item;
  }

  public static async validateRequiredItems(repo: ItemRepository, itemTrade: Partial<ItemTradeEntity>): Promise<void> {
    if (itemTrade?.requiredItems?.length) {
      const promises = itemTrade.requiredItems.map((el) => this.validateItemExists(repo, el.itemId));
      await Promise.all(promises);
    }
  }

  public static async validateAccountHasRequiredItems(
    repo: ItemInstanceRepository,
    itemTrade: ItemTradeEntity,
    accountId: string,
  ): Promise<void> {
    if (!itemTrade.requiredItems?.length) {
      return;
    }

    const itemsIds = itemTrade.requiredItems.map(el => el.itemId);
    let { payload: itemInstances } = await repo.listByItemsIds(itemsIds, accountId);
    itemInstances = itemInstances.filter(el => el?.quantity);
    for (let req of itemTrade.requiredItems) {
      const itemInstance = itemInstances.find(el => el.itemId === req.itemId);
      if ((itemInstance?.quantity ?? 0) < req.quantity) {
        throw new UsecaseException(ExceptionCode.AccountDoesNotHaveEnoughItemInstanceQuantity, `Account does not have enough item quantity, id: ${req.itemId}`);
      }
    }
  }

  public static async validateAccountHasLessItems(
    repo: ItemInstanceRepository,
    accountId: string,
    itemId: string,
    quantity: number,
  ): Promise<void> {
    if (!quantity) {
      return;
    }

    const itemInstance = await repo.find({ filter: { itemId, accountId } });
    const accountQuantity = itemInstance?.quantity ?? 0;

    if (accountQuantity >= quantity) {
      throw new UsecaseException(ExceptionCode.AccountHasTooMuchItemInstanceQuantity, `Account has too much item quantity, id: ${itemId}`);
    }
  }

  public static async validateExists(repo: ItemTradeRepository, id: string): Promise<ItemTradeEntity> {
    const item = await repo.find({ filter: { id } });
    if (!item) {
      throw new UsecaseException(ExceptionCode.ItemTradeDoesNotExist, `Item trade does not exist, id: ${id}`);
    }

    return item;
  }

  public static async validateUniqueKey(
    itemTradeRepository: ItemTradeRepository,
    key: string,
    id?: string,
  ): Promise<void> {
    const filter: any = { key };
    if (id) {
      filter.id = { $ne: id };
    }
    const item = await itemTradeRepository.find({ filter });
    if (item) {
      throw new UsecaseException(ExceptionCode.ItemTradeKeyIsAlreadyTaken, `Item trade key is already taken: ${key}`);
    }
  }

  public static validateQuantity(itemTrade: ItemTradeEntity): void {
    if (itemTrade && !ItemTradeEntity.isQuantityValid(itemTrade)) {
      throw new UsecaseException(ExceptionCode.ItemTradeQuantityIsInvalid, 'Quantity of item trade is invalid');
    }
  }
}
