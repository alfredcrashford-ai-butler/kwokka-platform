import { ProfileEntity } from './profile.entity';

describe(ProfileEntity, () => {
  it('exists', () => {
    expect(ProfileEntity).toBeTruthy();
  });

  it('works', () => {
    expect(new ProfileEntity({ accountId: '12345', name: 'sharadbrat', locale: 'en' })).toBeTruthy();
  });
});
