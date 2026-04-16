import { AccountEntityType } from './account.entity';
import {
  AccessTokenEntity,
  RefreshTokenEntity,
  RestoreTokenEntity,
  TokenEntity,
  TokenEntityType,
  VerifyTokenEntity,
} from './token.entity';

describe(TokenEntity, () => {
  it('exists', () => {
    expect(TokenEntity).toBeTruthy();
  });

  it('works', () => {
    const token = new TokenEntity({
      type: TokenEntityType.Access,
      credentialId: 'cred_1',
      content: null,
      accountId: 'acc_1',
      correlationId: '12345',
    });

    expect(token).toBeTruthy();
  });

  describe('revoke()', () => {
    it('exists', () => {
      const token = new TokenEntity({
        type: TokenEntityType.Access,
        credentialId: 'cred_1',
        content: null,
        accountId: 'acc_1',
        correlationId: '12345',
      });

      expect(token.revoke).toBeInstanceOf(Function);
    });

    it('sets revokedAt to current date', () => {
      const token = new TokenEntity({
        type: TokenEntityType.Access,
        credentialId: 'cred_1',
        content: null,
        accountId: 'acc_1',
        correlationId: '12345',
      });

      token.revoke();

      expect(token.revokedAt).toBeInstanceOf(Date);
    });
  });

  describe('isExpired()', () => {
    it('returns true for old token', () => {
      const token = new TokenEntity({
        type: TokenEntityType.Access,
        credentialId: 'cred_1',
        content: null,
        accountId: 'acc_1',
        correlationId: '12345',
        expiresAt: new Date(0),
      });

      expect(token.isExpired()).toEqual(true);
    });

    it('returns false for token that expires in the future', () => {
      const token = new TokenEntity({
        type: TokenEntityType.Access,
        credentialId: 'cred_1',
        content: null,
        accountId: 'acc_1',
        correlationId: '12345',
        expiresAt: new Date(Date.now() + 1000),
      });

      expect(token.isExpired()).toEqual(false);
    });

    it('returns false for token without expiry date', () => {
      const token = new TokenEntity({
        type: TokenEntityType.Access,
        credentialId: 'cred_1',
        content: null,
        accountId: 'acc_1',
        correlationId: '12345'
      });

      expect(token.isExpired()).toEqual(false);
    });
  });


  describe('isRevoked()', () => {
    it('returns false for token without revokedAt', () => {
      const token = new TokenEntity({
        type: TokenEntityType.Access,
        credentialId: 'cred_1',
        content: null,
        accountId: 'acc_1',
        correlationId: '12345',
      });

      expect(token.isRevoked()).toEqual(false);
    });

    it('returns true for token with revokedAt', () => {
      const token = new TokenEntity({
        type: TokenEntityType.Access,
        credentialId: 'cred_1',
        content: null,
        accountId: 'acc_1',
        correlationId: '12345',
        revokedAt: new Date(),
      });

      expect(token.isRevoked()).toEqual(true);
    });
  });
});

describe(AccessTokenEntity, () => {
  it('exists', () => {
    expect(AccessTokenEntity).toBeTruthy();
  });

  it('works', () => {
    const token = new AccessTokenEntity({
      content: {
        type: TokenEntityType.Access,
        accountType: AccountEntityType.User,
        rights: [],
        jti: '',
        iat: 0,
        exp: 0,
        correlationId: '12345',
        accountId: 'acc_1',
      },
      correlationId: '12345',
      credentialId: 'cred_1',
      accountId: 'acc_1',
    });

    expect(token).toBeTruthy();
  });
});

describe(RefreshTokenEntity, () => {
  it('exists', () => {
    expect(RefreshTokenEntity).toBeTruthy();
  });

  it('works', () => {
    const token = new RefreshTokenEntity({
      content: {
        type: TokenEntityType.Refresh,
        jti: '',
        iat: 0,
        exp: 0,
        correlationId: '12345',
        accountId: 'acc_1',
      },
      correlationId: '12345',
      credentialId: 'cred_1',
      accountId: 'acc_1',
    });

    expect(token).toBeTruthy();
  });
});

describe(RestoreTokenEntity, () => {
  it('exists', () => {
    expect(RestoreTokenEntity).toBeTruthy();
  });

  it('works', () => {
    const token = new RestoreTokenEntity({
      content: {
        type: TokenEntityType.Restore,
        data: {},
        jti: '',
        iat: 0,
        exp: 0,
        correlationId: '12345',
        accountId: 'acc_1',
      },
      correlationId: '12345',
      credentialId: 'cred_1',
      accountId: 'acc_1',
    });

    expect(token).toBeTruthy();
  });
});

describe(VerifyTokenEntity, () => {
  it('exists', () => {
    expect(VerifyTokenEntity).toBeTruthy();
  });

  it('works', () => {
    const token = new VerifyTokenEntity({
      content: {
        type: TokenEntityType.Verify,
        credentialId: 'cred_1',
        jti: '',
        iat: 0,
        exp: 0,
        correlationId: '12345',
        accountId: 'acc_1',
      },
      correlationId: '12345',
      credentialId: 'cred_1',
      accountId: 'acc_1',
    });

    expect(token).toBeTruthy();
  });
});
