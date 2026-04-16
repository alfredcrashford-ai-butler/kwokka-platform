import { AccessRoleEntity } from './access-role.entity';

describe(AccessRoleEntity, () => {
  it('exists', () => {
    expect(AccessRoleEntity).toBeTruthy();
  });

  it('works', () => {
    expect(
      new AccessRoleEntity({ name: 'name', description: 'Access role to manage stuff', accessRightsIds: [] }),
    ).toBeTruthy();
  });
});
