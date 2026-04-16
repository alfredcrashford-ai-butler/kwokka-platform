import { DecorationEntity, DecorationEntityType } from './decoration.entity';

describe(DecorationEntity, () => {
  it('exists', () => {
    expect(DecorationEntity).toBeTruthy();
  });

  it('works', () => {
    expect(
      new DecorationEntity({
        applicationAccountId: '123',
        key: 'avatar',
        type: DecorationEntityType.Image,
      }),
    ).toBeTruthy();
  });
});
