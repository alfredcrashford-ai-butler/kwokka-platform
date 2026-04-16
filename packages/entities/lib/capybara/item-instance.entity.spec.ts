import { ItemInstanceEntity } from './item-instance.entity';

describe(ItemInstanceEntity, () => {
  it('exists', () => {
    expect(ItemInstanceEntity).toBeTruthy();
  });

  it('works', () => {
    expect(new ItemInstanceEntity({ accountId: '12345', itemId: '0987', quantity: 4 })).toBeTruthy();
  });
});
