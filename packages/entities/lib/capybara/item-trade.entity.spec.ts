import { ItemTradeEntity } from './item-trade.entity';

describe(ItemTradeEntity, () => {
  it('exists', () => {
    expect(ItemTradeEntity).toBeTruthy();
  });

  it('works', () => {
    expect(
      new ItemTradeEntity({
        key: 'my_item_trade',
        itemId: '123',
        quantity: 1,
        tradedItemId: '123',
        tradedItemQuantity: 1,
      }),
    ).toBeTruthy();
  });

  describe('isQuantityValid()', () => {
    it('exists', () => {
      expect(ItemTradeEntity.isQuantityValid).toBeTruthy();
    });

    it('returns true when both quantities are higher than 0', () => {
      const trade = new ItemTradeEntity({
        key: 'my_item_trade',
        itemId: '1',
        quantity: 1,
        tradedItemId: '2',
        tradedItemQuantity: 1,
      });
      expect(ItemTradeEntity.isQuantityValid(trade)).toEqual(true);
    });

    it('returns false when quantity is less than 0', () => {
      const trade = new ItemTradeEntity({
        key: 'my_item_trade',
        itemId: '1',
        quantity: 0,
        tradedItemId: '2',
        tradedItemQuantity: 1,
      });
      expect(ItemTradeEntity.isQuantityValid(trade)).toEqual(false);
    });

    it('returns false when quantity is undefined', () => {
      const trade = new ItemTradeEntity({
        key: 'my_item_trade',
        itemId: '1',
        quantity: undefined as any,
        tradedItemId: '2',
        tradedItemQuantity: 1,
      });
      expect(ItemTradeEntity.isQuantityValid(trade)).toEqual(false);
    });

    it('returns true when tradedItemQuantity is 0', () => {
      const trade = new ItemTradeEntity({
        key: 'my_item_trade',
        itemId: '1',
        quantity: 1,
        tradedItemId: '2',
        tradedItemQuantity: 0,
      });
      expect(ItemTradeEntity.isQuantityValid(trade)).toEqual(true);
    });

    it('returns false when tradedItemQuantity is less than 0', () => {
      const trade = new ItemTradeEntity({
        key: 'my_item_trade',
        itemId: '1',
        quantity: 1,
        tradedItemId: '2',
        tradedItemQuantity: -1,
      });
      expect(ItemTradeEntity.isQuantityValid(trade)).toEqual(false);
    });

    it('returns true when tradedItemQuantity is undefined', () => {
      const trade = new ItemTradeEntity({
        key: 'my_item_trade',
        itemId: '1',
        quantity: 1,
        tradedItemId: '2',
        tradedItemQuantity: undefined as any,
      });
      expect(ItemTradeEntity.isQuantityValid(trade)).toEqual(true);
    });

    it('returns true when requiredItems is empty array', () => {
      const trade = new ItemTradeEntity({
        key: 'my_item_trade',
        itemId: '1',
        quantity: 1,
        tradedItemId: '2',
        tradedItemQuantity: 1,
        requiredItems: [],
      });
      expect(ItemTradeEntity.isQuantityValid(trade)).toEqual(true);
    });

    it('returns true when requiredItems is undefined', () => {
      const trade = new ItemTradeEntity({
        key: 'my_item_trade',
        itemId: '1',
        quantity: 1,
        tradedItemId: '2',
        tradedItemQuantity: 1,
        requiredItems: undefined as any,
      });
      expect(ItemTradeEntity.isQuantityValid(trade)).toEqual(true);
    });

    it('returns false when at least 1 item in requiredItems has quantity equal or less than 0', () => {
      const trade = new ItemTradeEntity({
        key: 'my_item_trade',
        itemId: '1',
        quantity: 1,
        tradedItemId: '2',
        tradedItemQuantity: 1,
        requiredItems: [{ itemId: '3', quantity: 0 }, { itemId: '4', quantity: 1 }],
      });
      expect(ItemTradeEntity.isQuantityValid(trade)).toEqual(false);
    });

    it('returns true when all items in requiredItems has quantity more than 0', () => {
      const trade = new ItemTradeEntity({
        key: 'my_item_trade',
        itemId: '1',
        quantity: 1,
        tradedItemId: '2',
        tradedItemQuantity: 1,
        requiredItems: [{ itemId: '3', quantity: 2 }, { itemId: '4', quantity: 1 }],
      });
      expect(ItemTradeEntity.isQuantityValid(trade)).toEqual(true);
    });

    it('returns false when maxQuantity is less or equal to 0', () => {
      const trade = new ItemTradeEntity({
        key: 'my_item_trade',
        itemId: '1',
        quantity: 1,
        tradedItemId: '2',
        tradedItemQuantity: 1,
        maxQuantity: 0,
      });
      expect(ItemTradeEntity.isQuantityValid(trade)).toEqual(false);
    });
  });
});
