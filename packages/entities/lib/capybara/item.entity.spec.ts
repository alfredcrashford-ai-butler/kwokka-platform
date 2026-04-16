import {
  ItemEntity,
  ItemEntityAction,
  ItemEntityActionEffectType,
  ItemEntityActionTrigger,
  ItemEntityRarity,
} from './item.entity';

describe(ItemEntity, () => {
  function getItem(actions: ItemEntityAction[] = []): ItemEntity {
    return new ItemEntity({
      key: 'booster',
      applicationAccountId: 'pwsm',
      isTransferrable: true,
      actions,
      tags: [],
      rarity: ItemEntityRarity.Common,
      maxQuantity: 3,
    });
  }

  it('exists', () => {
    expect(ItemEntity).toBeTruthy();
  });

  it('works', () => {
    expect(getItem()).toBeTruthy();
  });

  describe('hasForbiddenActionSettings()', () => {
    it('returns true for combination of have + getItems', () => {
      const item = getItem([
        {
          trigger: ItemEntityActionTrigger.Have,
          effects: [{ type: ItemEntityActionEffectType.GetItems, settings: { items: [] } }],
          key: 'have',
        },
      ]);

      expect(item.hasForbiddenActionSettings()).toEqual(true);
    });

    it('returns true for combination of have + getRandomItems', () => {
      const item = getItem([
        {
          trigger: ItemEntityActionTrigger.Have,
          effects: [{ type: ItemEntityActionEffectType.GetRandomItems, settings: { items: [], quantity: 1 } }],
          key: 'have',
        },
      ]);

      expect(item.hasForbiddenActionSettings()).toEqual(true);
    });

    it('returns true for combination of have + destroy', () => {
      const item = getItem([
        {
          trigger: ItemEntityActionTrigger.Have,
          effects: [{ type: ItemEntityActionEffectType.Destroy }],
          key: 'have',
        },
      ]);

      expect(item.hasForbiddenActionSettings()).toEqual(true);
    });

    it('returns true for combination of use + unlockDecoration', () => {
      const item = getItem([
        {
          trigger: ItemEntityActionTrigger.Use,
          effects: [{ type: ItemEntityActionEffectType.UnlockDecorations, settings: { decorationsIds: [] } }],
          key: 'use',
        },
      ]);

      expect(item.hasForbiddenActionSettings()).toEqual(true);
    });

    // it('returns true for combination of combine + unlockDecoration', () => {
    //   const item = getItem([
    //     {
    //       trigger: ItemEntityActionTrigger.Combine,
    //       effects: [{ type: ItemEntityActionEffectType.UnlockDecorations, settings: { decorationsIds: [] } }],
    //       key: 'combine',
    //     },
    //   ]);

    //   expect(item.hasForbiddenActionSettings()).toEqual(true);
    // });

    it('returns false for combination of use + getItems', () => {
      const item = getItem([
        {
          trigger: ItemEntityActionTrigger.Use,
          effects: [{ type: ItemEntityActionEffectType.GetItems, settings: { items: [] } }],
          key: 'use',
        },
      ]);

      expect(item.hasForbiddenActionSettings()).toEqual(false);
    });

    it('returns false for multiple correct settings', () => {
      const item = getItem([
        {
          trigger: ItemEntityActionTrigger.Use,
          effects: [
            { type: ItemEntityActionEffectType.GetItems, settings: { items: [] } },
            { type: ItemEntityActionEffectType.GetRandomItems, settings: { items: [], quantity: 1 } },
            { type: ItemEntityActionEffectType.Destroy, quantity: 1 },
          ],
          key: 'use',
        },
      ]);

      expect(item.hasForbiddenActionSettings()).toEqual(false);
    });

    it('returns true for multiple incorrect settings', () => {
      const item = getItem([
        {
          trigger: ItemEntityActionTrigger.Have,
          effects: [
            { type: ItemEntityActionEffectType.UnlockDecorations, settings: { decorationsIds: [] } },
            { type: ItemEntityActionEffectType.GetItems, settings: { items: [] } },
            { type: ItemEntityActionEffectType.Destroy, quantity: 1 },
          ],
          key: 'use',
        },
      ]);

      expect(item.hasForbiddenActionSettings()).toEqual(true);
    });
  });

  describe('areActionsValid()', () => {
    it('returns false when contains forbidden configurations', () => {
      const item = getItem([
        {
          trigger: ItemEntityActionTrigger.Use,
          effects: [{ type: ItemEntityActionEffectType.UnlockDecorations, settings: { decorationsIds: ['123'] } }],
          key: 'use',
        },
      ]);

      expect(item.areActionsValid()).toEqual(false);
    });

    it('returns false when actions have empty effects', () => {
      const item = getItem([
        {
          trigger: ItemEntityActionTrigger.Use,
          effects: undefined as any,
          key: 'use',
        },
      ]);

      expect(item.areActionsValid()).toEqual(false);
    });

    it('returns false when actions have unknown effects', () => {
      const item = getItem([
        {
          trigger: ItemEntityActionTrigger.Use,
          effects: [{ type: 'unknown' } as any],
          key: 'use',
        },
      ]);

      expect(item.areActionsValid()).toEqual(false);
    });

    it('returns false when settings are empty in unlock decorations effect', () => {
      const item = getItem([
        {
          trigger: ItemEntityActionTrigger.Have,
          effects: [{ type: ItemEntityActionEffectType.UnlockDecorations, settings: undefined as any }],
          key: 'have',
        },
      ]);

      expect(item.areActionsValid()).toEqual(false);
    });

    it('returns false when decorationIds are empty array in unlock decorations effect', () => {
      const item = getItem([
        {
          trigger: ItemEntityActionTrigger.Have,
          effects: [{ type: ItemEntityActionEffectType.UnlockDecorations, settings: { decorationsIds: [] } }],
          key: 'have',
        },
      ]);

      expect(item.areActionsValid()).toEqual(false);
    });

    it('returns false when actions keys are not unique', () => {
      const item = getItem([
        {
          trigger: ItemEntityActionTrigger.Use,
          effects: [
            { type: ItemEntityActionEffectType.GetItems, settings: { items: [{ itemId: '123', quantity: 1 }] } },
          ],
          key: 'use',
        },
        {
          trigger: ItemEntityActionTrigger.Use,
          effects: [
            { type: ItemEntityActionEffectType.GetItems, settings: { items: [{ itemId: '123', quantity: 1 }] } },
          ],
          key: 'use',
        },
      ]);

      expect(item.areActionsValid()).toEqual(false);
    });

    it('returns false when settings are empty in get items effect', () => {
      const item = getItem([
        {
          trigger: ItemEntityActionTrigger.Use,
          effects: [{ type: ItemEntityActionEffectType.GetItems, settings: undefined as any }],
          key: 'use',
        },
      ]);

      expect(item.areActionsValid()).toEqual(false);
    });

    it('returns false when items have incorrect configuration in get items effect (itemId is undefined)', () => {
      const item = getItem([
        {
          trigger: ItemEntityActionTrigger.Use,
          effects: [
            {
              type: ItemEntityActionEffectType.GetItems,
              settings: { items: [{ itemId: undefined as any, quantity: 1 }] },
            },
          ],
          key: 'use',
        },
      ]);

      expect(item.areActionsValid()).toEqual(false);
    });

    it('returns false when items have incorrect configuration in get items effect (quantity is negative)', () => {
      const item = getItem([
        {
          trigger: ItemEntityActionTrigger.Use,
          effects: [
            { type: ItemEntityActionEffectType.GetItems, settings: { items: [{ itemId: '123', quantity: -1 }] } },
          ],
          key: 'use',
        },
      ]);

      expect(item.areActionsValid()).toEqual(false);
    });

    it('returns false when items are empty in get items effect', () => {
      const item = getItem([
        {
          trigger: ItemEntityActionTrigger.Use,
          effects: [{ type: ItemEntityActionEffectType.GetItems, settings: { items: [] } }],
          key: 'use',
        },
      ]);

      expect(item.areActionsValid()).toEqual(false);
    });

    it('returns false when items have incorrect configuration in get random items effect (itemId is undefined)', () => {
      const item = getItem([
        {
          trigger: ItemEntityActionTrigger.Use,
          effects: [
            {
              type: ItemEntityActionEffectType.GetRandomItems,
              settings: { items: [{ itemId: undefined as any, quantity: 1, weight: 1 }], quantity: 1 },
            },
          ],
          key: 'use',
        },
      ]);

      expect(item.areActionsValid()).toEqual(false);
    });

    it('returns false when settings are empty in get random items effect', () => {
      const item = getItem([
        {
          trigger: ItemEntityActionTrigger.Use,
          effects: [{ type: ItemEntityActionEffectType.GetRandomItems, settings: undefined as any }],
          key: 'use',
        },
      ]);

      expect(item.areActionsValid()).toEqual(false);
    });

    it('returns false when settings.quantity are empty in get random items effect', () => {
      const item = getItem([
        {
          trigger: ItemEntityActionTrigger.Use,
          effects: [
            {
              type: ItemEntityActionEffectType.GetRandomItems,
              settings: { items: [{ itemId: '123', quantity: 1, weight: 1 }], quantity: undefined } as any,
            },
          ],
          key: 'use',
        },
      ]);

      expect(item.areActionsValid()).toEqual(false);
    });

    it('returns false when items have incorrect configuration in get random items effect (quantity is negative)', () => {
      const item = getItem([
        {
          trigger: ItemEntityActionTrigger.Use,
          effects: [
            {
              type: ItemEntityActionEffectType.GetRandomItems,
              settings: { items: [{ itemId: '123', quantity: -1, weight: 1 }], quantity: 1 },
            },
          ],
          key: 'use',
        },
      ]);

      expect(item.areActionsValid()).toEqual(false);
    });

    it('returns false when items have incorrect configuration in get random items effect (weight is negative)', () => {
      const item = getItem([
        {
          trigger: ItemEntityActionTrigger.Use,
          effects: [
            {
              type: ItemEntityActionEffectType.GetRandomItems,
              settings: { items: [{ itemId: '123', quantity: 1, weight: -1 }], quantity: 1 },
            },
          ],
          key: 'use',
        },
      ]);

      expect(item.areActionsValid()).toEqual(false);
    });

    it('returns false when items are empty in get random items effect', () => {
      const item = getItem([
        {
          trigger: ItemEntityActionTrigger.Use,
          effects: [
            {
              type: ItemEntityActionEffectType.GetRandomItems,
              settings: { items: [], quantity: 1 },
            },
          ],
          key: 'use',
        },
      ]);

      expect(item.areActionsValid()).toEqual(false);
    });

    it('returns false when items have incorrect configuration in get random items effect (global quantity is negative)', () => {
      const item = getItem([
        {
          trigger: ItemEntityActionTrigger.Use,
          effects: [
            {
              type: ItemEntityActionEffectType.GetRandomItems,
              settings: { items: [{ itemId: '123', quantity: 1, weight: 1 }], quantity: -1 },
            },
          ],
          key: 'use',
        },
      ]);

      expect(item.areActionsValid()).toEqual(false);
    });

    it('returns true when keys are unique and effects configurations are correct', () => {
      const item = getItem([
        {
          trigger: ItemEntityActionTrigger.Use,
          effects: [
            {
              type: ItemEntityActionEffectType.GetRandomItems,
              settings: { items: [{ itemId: '123', quantity: 1, weight: 1 }], quantity: 1 },
            },
            {
              type: ItemEntityActionEffectType.GetItems,
              settings: { items: [{ itemId: '123', quantity: 1 }] },
            },
            { type: ItemEntityActionEffectType.Destroy, quantity: 1 },
          ],
          key: 'use',
        },
        {
          trigger: ItemEntityActionTrigger.Have,
          effects: [
            {
              type: ItemEntityActionEffectType.UnlockDecorations,
              settings: { decorationsIds: ['1', '2'] },
            },
          ],
          key: 'have',
        },
      ]);

      expect(item.areActionsValid()).toEqual(true);
    });
  });

  describe('isEffectValid()', () => {
    it('exists', () => {
      expect(ItemEntity.isEffectValid).toBeTruthy();
    });

    it('returns false when using unknown type', () => {
      expect(ItemEntity.isEffectValid({ type: 'unknown' } as any)).toEqual(false);
    });

    it('returns true for destroy effect without quantity', () => {
      expect(ItemEntity.isEffectValid({ type: ItemEntityActionEffectType.Destroy })).toEqual(true);
    });

    it('returns true for destroy effect with positive quantity', () => {
      expect(ItemEntity.isEffectValid({ type: ItemEntityActionEffectType.Destroy, quantity: 1 })).toEqual(true);
    });

    it('returns false for destroy effect with 0 quantity', () => {
      expect(ItemEntity.isEffectValid({ type: ItemEntityActionEffectType.Destroy, quantity: 0 })).toEqual(false);
    });
  });
});
