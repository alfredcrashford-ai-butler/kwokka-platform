import { ItemEntity, ItemInstanceEntity } from '@kwokka/entities';
import { UsecaseException } from '@kwokka/common-node';
import { ExceptionCode } from '../exception-code';
import { ItemInstanceRepository, ItemRepository } from '../ports';

export class ItemInstanceUsecaseValidations {
  public static validateAction(item: ItemEntity, actionKey: string): void {
    const action = item.actions.find((action) => action.key === actionKey);
    if (!action) {
      throw new UsecaseException(
        ExceptionCode.ItemActionDoesNotExist,
        `Action with key: ${actionKey} does not exist for the item with id: ${item.id}`,
      );
    }

    if (!ItemEntity.runnableTriggers.includes(action.trigger)) {
      throw new UsecaseException(
        ExceptionCode.ItemActionNotRunnable,
        `Action with key: ${actionKey} is not runnable, needs to have one of the following triggers: ${ItemEntity.runnableTriggers}`,
      );
    }
  }

  public static validatePositiveQuantity(quantity: number): void {
    if (quantity < 0) {
      throw new UsecaseException(
        ExceptionCode.ItemExchangeRequestHasNonPositiveQuantity,
        `Quantity is not positive: ${quantity}`,
      );
    }
  }

  public static validateAccountHasEnoughItemInstanceQuantity(itemInstance: ItemInstanceEntity, quantity: number): void {
    const actualQuantity = itemInstance?.quantity || 0;
    if (actualQuantity < quantity) {
      throw new UsecaseException(
        ExceptionCode.AccountDoesNotHaveEnoughItemInstanceQuantity,
        `Account does not have enough quantity of item, needs: ${quantity}, has: ${actualQuantity}`,
      );
    }
  }

  public static async validateExists(
    itemInstanceRepository: ItemInstanceRepository,
    id: string,
  ): Promise<ItemInstanceEntity> {
    const itemInstance = await itemInstanceRepository.find({ filter: { id } });
    if (!itemInstance) {
      throw new UsecaseException(ExceptionCode.ItemInstanceDoesNotExist, `Profile do not exist, id: ${id}`);
    }
    return itemInstance;
  }

  public static async validateItemExists(itemRepository: ItemRepository, filter: any): Promise<ItemEntity> {
    const item = await itemRepository.find({ filter });
    if (!item) {
      throw new UsecaseException(
        ExceptionCode.ItemDoesNotExist,
        `Item does not exist, filter: ${JSON.stringify(filter)}`,
      );
    }
    return item;
  }

  public static async validateItemInstanceExists(
    itemInstanceRepository: ItemInstanceRepository,
    filter: any,
  ): Promise<ItemInstanceEntity> {
    const itemInstance = await itemInstanceRepository.find({ filter });

    if (!itemInstance) {
      throw new UsecaseException(
        ExceptionCode.ItemInstanceDoesNotExist,
        `Item instance does not exist, filter: ${JSON.stringify(filter)}`,
      );
    }

    return itemInstance;
  }
}
