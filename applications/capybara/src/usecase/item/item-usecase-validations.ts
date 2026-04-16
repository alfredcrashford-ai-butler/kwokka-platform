import {
  ItemEntity,
  ItemEntityActionEffectSettings,
  ItemEntityActionEffectType,
  ItemEntityGetItemsActionEffect,
  ItemEntityGetRandomItemsActionEffect,
  ItemEntityUnlockDecorationsActionEffect,
} from '@kwokka/entities';
import { UsecaseException } from '@kwokka/common-node';
import { ExceptionCode } from '../exception-code';
import { ItemRepository, DecorationRepository } from '../ports';

export class ItemUsecaseValidations {
  public static async validateExists(itemRepository: ItemRepository, id: string): Promise<ItemEntity> {
    const item = await itemRepository.find({ filter: { id } });
    if (!item) {
      throw new UsecaseException(ExceptionCode.ItemDoesNotExist, `Item does not exist, id: ${id}`);
    }

    return item;
  }

  public static async validateUniqueKey(itemRepository: ItemRepository, key: string, id?: string): Promise<void> {
    const filter: any = { key };
    if (id) {
      filter.id = { $ne: id };
    }
    const item = await itemRepository.find({ filter });
    if (item) {
      throw new UsecaseException(ExceptionCode.ItemKeyIsAlreadyTaken, `Item key is already taken: ${key}`);
    }
  }

  public static async validateActions(
    itemRepository: ItemRepository,
    decorationRepository: DecorationRepository,
    item: Partial<ItemEntity>,
  ): Promise<void> {
    // Step 1: check config form
    const areActionsValid = ItemEntity.areActionsValid(item.actions);
    if (!areActionsValid) {
      throw new UsecaseException(ExceptionCode.ItemActionsAreInvalid, 'Actions configuration is invalid');
    }

    // Step 2: check entities exist
    await this.validateActionEntities(itemRepository, decorationRepository, item);
  }

  public static validateNoApplicationAccountId(item: Partial<ItemEntity>): void {
    if (item.applicationAccountId) {
      throw new UsecaseException(
        ExceptionCode.UpdateOfApplicationAccountIdInItemNotAllowed,
        'Update of application account id in item is not allowed',
      );
    }
  }

  private static extractDecorationIdsFromEffect(effect: ItemEntityActionEffectSettings, targetArray: string[]): void {
    const decorationEffect = effect as ItemEntityUnlockDecorationsActionEffect;
    targetArray.push(...decorationEffect.settings.decorationsIds);
  }

  private static extractItemIdsFromEffect(effect: ItemEntityActionEffectSettings, targetArray: string[]): void {
    const itemEffect = effect as ItemEntityGetItemsActionEffect | ItemEntityGetRandomItemsActionEffect;
    const effectItemIds = itemEffect.settings.items.map((el) => el.itemId);
    targetArray.push(...effectItemIds);
  }

  private static async validateActionEntities(
    itemRepository: ItemRepository,
    decorationRepository: DecorationRepository,
    item: Partial<ItemEntity>,
  ): Promise<void> {
    let itemIds = [];
    let decorationIds = [];
    const effects = item.actions.flatMap((action) => action.effects);
    effects.forEach((effect) => {
      if ([ItemEntityActionEffectType.GetItems, ItemEntityActionEffectType.GetRandomItems].includes(effect.type)) {
        this.extractItemIdsFromEffect(effect, itemIds);
      } else if (effect.type === ItemEntityActionEffectType.UnlockDecorations) {
        this.extractDecorationIdsFromEffect(effect, decorationIds);
      }
    });
    itemIds = Array.from(new Set(itemIds));
    decorationIds = Array.from(new Set(decorationIds));

    if (itemIds.length) {
      const itemResponse = await itemRepository.listByIds(itemIds);
      if (itemResponse.payload.length < itemIds.length) {
        throw new UsecaseException(
          ExceptionCode.ItemDoesNotExist,
          `Some items from action configuration do not exist, ids: ${itemIds}`,
        );
      }
    }

    if (decorationIds.length) {
      const decorationResponse = await decorationRepository.listByIds(decorationIds);
      if (decorationResponse.payload.length < itemIds.length) {
        throw new UsecaseException(
          ExceptionCode.DecorationDoesNotExist,
          `Some decorations from action configuration do not exist, ids: ${decorationIds}`,
        );
      }
    }
  }
}
