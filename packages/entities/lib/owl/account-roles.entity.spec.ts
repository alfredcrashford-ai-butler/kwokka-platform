import { AccountRolesEntity } from './account-roles.entity';

describe(AccountRolesEntity, () => {
  it('exists', () => {
    expect(AccountRolesEntity).toBeTruthy();
  });

  it('works', () => {
    expect(new AccountRolesEntity({ accountId: 'acc_1', accessRoles: [{ id: 'role_1', enabled: true }] })).toBeTruthy();
  });
});
