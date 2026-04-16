import { ItemTransactionEntity, ItemTransactionType } from './item-transaction.entity';

describe(ItemTransactionEntity, () => {
  it('exists', () => {
    expect(ItemTransactionEntity).toBeTruthy();
  });

  it('works', () => {
    expect(
      new ItemTransactionEntity({
        id: '123',
        type: ItemTransactionType.Trade,
        itemId: '123',
        accountId: '123',
        transactionDetails: { tradeId: '123' },
      }),
    ).toBeTruthy();
  });
});
