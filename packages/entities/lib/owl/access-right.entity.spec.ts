import { AccessRightEntity } from './access-right.entity';

describe(AccessRightEntity, () => {
  it('exists', () => {
    expect(AccessRightEntity).toBeTruthy();
  });

  it('works', () => {
    expect(new AccessRightEntity({ name: 'name' })).toBeTruthy();
  });
});
