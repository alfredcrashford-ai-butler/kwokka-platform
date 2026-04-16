import { PublicProps } from '@kwokka/utils';
import { Entity } from '../entity';

export enum ItemEntityRarity {
  Junk = 'junk',
  Common = 'common',
  Uncommon = 'uncommon',
  Rare = 'rare',
  Epic = 'epic',
  Legendary = 'legendary',
  Immortal = 'immortal',
}

export enum ItemEntityActionTrigger {
  // Combine = 'combine',
  Use = 'use',
  Have = 'have',
  // Timely = 'timely',
}

export enum ItemEntityActionEffectType {
  GetItems = 'get_items',
  GetRandomItems = 'get_random_items',
  // Buff = 'buff',
  UnlockDecorations = 'unlock_decoration',
  Destroy = 'destroy',
}

export interface ItemEntityGetItemsActionEffect {
  type: ItemEntityActionEffectType.GetItems;
  settings: {
    items: { itemId: string; quantity: number }[];
  };
}

export interface ItemEntityGetRandomItemsActionEffect {
  type: ItemEntityActionEffectType.GetRandomItems;
  settings: {
    items: { itemId: string; quantity: number; weight: number }[];
    quantity: number;
  };
}

// export interface ItemEntityBuffActionEffect {
//   effect: ItemEntityActionEffect.Buff;
//   effectSettings: {

//   };
// }

export interface ItemEntityDestroyActionEffect {
  type: ItemEntityActionEffectType.Destroy;
  quantity?: number;
}

export interface ItemEntityUnlockDecorationsActionEffect {
  type: ItemEntityActionEffectType.UnlockDecorations;
  settings: {
    decorationsIds: string[];
  };
}

export type ItemEntityActionEffectSettings =
  | ItemEntityGetItemsActionEffect
  | ItemEntityGetRandomItemsActionEffect
  | ItemEntityDestroyActionEffect
  // | ItemEntityBuffActionEffect
  | ItemEntityUnlockDecorationsActionEffect;

export interface ItemEntityAction {
  trigger: ItemEntityActionTrigger;
  key: string;
  effects: ItemEntityActionEffectSettings[];
}

export class ItemEntity extends Entity {
  public key: string;
  public applicationAccountId?: string;
  public isTransferrable: boolean;
  public actions: ItemEntityAction[];
  public tags: string[];
  public rarity: ItemEntityRarity;
  public maxQuantity?: number;
  public static readonly runnableTriggers = [ItemEntityActionTrigger.Use];

  public static readonly triggerToActionWhitelist = {
    // [ItemEntityActionTrigger.Combine]: [
    //   ItemEntityActionEffectType.GetItems,
    //   ItemEntityActionEffectType.GetRandomItems,
    //   ItemEntityActionEffectType.Destroy,
    // ],
    [ItemEntityActionTrigger.Use]: [
      ItemEntityActionEffectType.GetItems,
      ItemEntityActionEffectType.GetRandomItems,
      ItemEntityActionEffectType.Destroy,
    ],
    [ItemEntityActionTrigger.Have]: [
      ItemEntityActionEffectType.UnlockDecorations,
      // ItemEntityActionEffect.Buff,
    ],
  };

  public constructor(params: PublicProps<ItemEntity>) {
    super(params);
    this.key = params.key;
    this.applicationAccountId = params.applicationAccountId;
    this.isTransferrable = params.isTransferrable;
    this.actions = params.actions;
    this.tags = params.tags;
    this.rarity = params.rarity;
    this.maxQuantity = params.maxQuantity;
  }

  public hasForbiddenActionSettings(): boolean {
    return ItemEntity.hasForbiddenActionSettings(this.actions);
  }

  public static hasForbiddenActionSettings(actions: ItemEntityAction[]): boolean {
    return !actions.every((action) =>
      action.effects.every((effect) => ItemEntity.triggerToActionWhitelist[action.trigger].includes(effect.type)),
    );
  }

  public areActionsValid(): boolean {
    return ItemEntity.areActionsValid(this.actions);
  }

  public static areActionsValid(actions: ItemEntityAction[]): boolean {
    // Step 1: check keys unique
    let keys = actions.map((action) => action.key);
    keys = Array.from(new Set(keys));
    if (keys.length !== actions.length) {
      return false;
    }

    // Step 2: check all actions have effects
    if (actions.find((action) => !action.effects?.length)) {
      return false;
    }

    // Step 3: check forbidden settings
    if (this.hasForbiddenActionSettings(actions)) {
      return false;
    }

    // Step 4: check configurations have correct format
    const effects: ItemEntityActionEffectSettings[] = [];
    actions.forEach((action) => effects.push(...action.effects));
    if (effects.find((effect) => !this.isEffectValid(effect))) {
      return false;
    }

    return true;
  }

  public static isEffectValid(effect: ItemEntityActionEffectSettings): boolean {
    if (effect.type === ItemEntityActionEffectType.GetItems) {
      return this.isGetItemsEffectValid(effect);
    }

    if (effect.type === ItemEntityActionEffectType.GetRandomItems) {
      return this.isGetRandomItemsEffectValid(effect);
    }

    if (effect.type === ItemEntityActionEffectType.UnlockDecorations) {
      return this.isUnlockDecorationsEffectValid(effect);
    }

    if (effect.type === ItemEntityActionEffectType.Destroy) {
      return this.isDestroyEffectValid(effect);
    }

    return false;
  }

  private static isGetItemsEffectValid(effect: ItemEntityActionEffectSettings): boolean {
    const theEffect = effect as ItemEntityGetItemsActionEffect;
    if (!theEffect.settings?.items?.length) {
      return false;
    }

    return theEffect.settings.items.every((item) => item.itemId && item.quantity > 0);
  }

  private static isGetRandomItemsEffectValid(effect: ItemEntityActionEffectSettings): boolean {
    const theEffect = effect as ItemEntityGetRandomItemsActionEffect;
    if (!theEffect.settings?.items?.length) {
      return false;
    }

    if ((theEffect.settings.quantity || 0) <= 0) {
      return false;
    }

    return theEffect.settings.items.every((item) => item.itemId && item.quantity > 0 && item.weight > 0);
  }

  private static isUnlockDecorationsEffectValid(effect: ItemEntityActionEffectSettings): boolean {
    const theEffect = effect as ItemEntityUnlockDecorationsActionEffect;
    if (!theEffect.settings?.decorationsIds?.length) {
      return false;
    }

    return Boolean(theEffect.settings.decorationsIds.length);
  }

  private static isDestroyEffectValid(effect: ItemEntityActionEffectSettings): boolean {
    const theEffect = effect as ItemEntityDestroyActionEffect;
    const quantity = theEffect.quantity ?? 1;
    return quantity > 0;
  }
}
