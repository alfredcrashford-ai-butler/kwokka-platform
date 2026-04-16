import { AccountEntity, AccountEntityType } from './account.entity';

describe(AccountEntity, () => {
  it('exists', () => {
    expect(AccountEntity).toBeTruthy();
  });

  it('works', () => {
    expect(new AccountEntity({ type: AccountEntityType.User, isActive: true, isVerified: true })).toBeTruthy();
  });

  it('creates active unverified user account by default', () => {
    const account = new AccountEntity({ type: null as any, isActive: null as any, isVerified: null as any });

    expect(account.type).toEqual(AccountEntityType.User);
    expect(account.isActive).toEqual(true);
    expect(account.isVerified).toEqual(false);
  });

  it('creates inactive account when isActive is set to false', () => {
    const account = new AccountEntity({ type: null as any, isActive: false, isVerified: true });

    expect(account.isActive).toEqual(false);
  });

  it('creates unverified account when isVerified is set to false', () => {
    const account = new AccountEntity({ type: null as any, isActive: null as any, isVerified: false });

    expect(account.isVerified).toEqual(false);
  });

  describe('getNewUserAccount()', () => {
    it('exists', () => {
      expect(AccountEntity.getNewUserAccount).toBeInstanceOf(Function);
    });

    it('returns new user account', () => {
      const account = AccountEntity.getNewUserAccount();

      expect(account.type).toEqual(AccountEntityType.User);
      expect(account).toBeInstanceOf(AccountEntity);
    });
  });
});
