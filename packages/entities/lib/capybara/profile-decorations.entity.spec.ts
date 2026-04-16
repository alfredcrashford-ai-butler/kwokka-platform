import { DecorationEntityType } from './decoration.entity';
import { ProfileDecorationsEntity } from './profile-decorations.entity';

describe(ProfileDecorationsEntity, () => {
  it('exists', () => {
    expect(ProfileDecorationsEntity).toBeTruthy();
  });

  it('works', () => {
    expect(
      new ProfileDecorationsEntity({
        profileId: '12345',
        decorations: {
          [DecorationEntityType.Image]: 'frog',
          [DecorationEntityType.Background]: 'cyberpunk',
          [DecorationEntityType.Badge]: 'coolkid',
        },
      }),
    ).toBeTruthy();
  });
});
