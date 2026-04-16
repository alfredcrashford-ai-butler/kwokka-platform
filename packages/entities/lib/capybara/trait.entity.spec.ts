import {
  TraitEntity,
  TraitType,
  CustomTraitEntity,
  ItemTraitEntity,
  TextTraitEntity,
  NumericTraitEntity,
  BooleanTraitEntity,
} from './trait.entity';

describe(TraitEntity, () => {
  it('exists', () => {
    expect(TraitEntity).toBeTruthy();
  });

  it('works', () => {
    expect(
      new TraitEntity({
        key: 'arena',
        type: TraitType.Numeric,
        isOwnerEditable: false,
        applicationAccountId: '123',
        config: {},
        defaultValue: 0,
      }),
    ).toBeTruthy();
  });
});

describe(NumericTraitEntity, () => {
  it('exists', () => {
    expect(NumericTraitEntity).toBeTruthy();
  });

  it('works', () => {
    expect(
      new NumericTraitEntity({
        key: 'experience',
        isOwnerEditable: false,
        applicationAccountId: '123',
        defaultValue: 0,
      }),
    ).toBeTruthy();
  });
});

describe(ItemTraitEntity, () => {
  it('exists', () => {
    expect(ItemTraitEntity).toBeTruthy();
  });

  it('works', () => {
    expect(
      new ItemTraitEntity({
        key: 'arena',
        isOwnerEditable: false,
        config: {
          allowedItemsIds: ['1', '2', '3'],
        },
        applicationAccountId: '123',
        defaultValue: '123',
      }),
    ).toBeTruthy();
  });
});

describe(CustomTraitEntity, () => {
  it('exists', () => {
    expect(CustomTraitEntity).toBeTruthy();
  });

  it('works', () => {
    expect(
      new CustomTraitEntity({
        key: 'stats',
        applicationAccountId: '123',
        defaultValue: '123',
      }),
    ).toBeTruthy();
  });
});

describe(TextTraitEntity, () => {
  it('exists', () => {
    expect(TextTraitEntity).toBeTruthy();
  });

  it('works', () => {
    expect(
      new TextTraitEntity({
        key: 'stats',
        applicationAccountId: '123',
        defaultValue: '123',
      }),
    ).toBeTruthy();
  });
});

describe(BooleanTraitEntity, () => {
  it('exists', () => {
    expect(BooleanTraitEntity).toBeTruthy();
  });

  it('works', () => {
    expect(
      new BooleanTraitEntity({
        key: 'stats',
        applicationAccountId: '123',
        defaultValue: false,
      }),
    ).toBeTruthy();
  });
});
