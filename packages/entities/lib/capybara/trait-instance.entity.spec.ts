import { TraitInstanceEntity } from './trait-instance.entity';

describe(TraitInstanceEntity, () => {
  it('exists', () => {
    expect(TraitInstanceEntity).toBeTruthy();
  });

  it('works', () => {
    expect(new TraitInstanceEntity({ accountId: 'acc', traitId: '123', value: 400 })).toBeTruthy();
  });

  it('works with empty value', () => {
    expect(new TraitInstanceEntity({ accountId: 'acc', traitId: '123', value: undefined })).toBeTruthy();
  });
});
