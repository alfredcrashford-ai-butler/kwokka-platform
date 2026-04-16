import { AccountTypeRolesEntity } from './account-type-roles.entity';
import { AccountEntityType } from './account.entity';

describe(AccountTypeRolesEntity, () => {
  it('exists', () => {
    expect(AccountTypeRolesEntity).toBeTruthy();
  });

  it('works', () => {
    expect(new AccountTypeRolesEntity({ type: AccountEntityType.User, accessRolesIds: ['role_1'] })).toBeTruthy();
  });
});
