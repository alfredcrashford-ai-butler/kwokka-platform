import { Entity } from './entity';

describe(Entity, () => {
  it('exists', () => {
    expect(Entity).toBeTruthy();
  });

  it('works', () => {
    expect(new Entity({})).toBeTruthy();
  });
});
