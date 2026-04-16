import { TokenFactory } from './token-factory';
import {
  AccessTokenEntity,
  RefreshTokenEntity,
  RestoreTokenEntity,
  TokenEntity,
  TokenEntityType,
  VerifyTokenEntity,
} from './token.entity';

describe(TokenFactory, () => {
  it('exists', () => {
    expect(TokenFactory).toBeTruthy();
  });

  describe('get()', () => {
    it('returns access token when is called with type - access', () => {
      const token = TokenFactory.get({
        type: TokenEntityType.Access,
        credentialId: 'cred_1',
        content: null,
        accountId: 'acc_1',
        correlationId: '12345',
      });

      expect(token).toBeInstanceOf(AccessTokenEntity);
    });

    it('returns refresh token when is called with type - refresh', () => {
      const token = TokenFactory.get({
        type: TokenEntityType.Refresh,
        credentialId: 'cred_1',
        content: null,
        accountId: 'acc_1',
        correlationId: '12345',
      });

      expect(token).toBeInstanceOf(RefreshTokenEntity);
    });

    it('returns access token when is called with type - restore', () => {
      const token = TokenFactory.get({
        type: TokenEntityType.Restore,
        credentialId: 'cred_1',
        content: null,
        accountId: 'acc_1',
        correlationId: '12345',
      });

      expect(token).toBeInstanceOf(RestoreTokenEntity);
    });

    it('returns access token when is called with type - verify', () => {
      const token = TokenFactory.get({
        type: TokenEntityType.Verify,
        credentialId: 'cred_1',
        content: null,
        accountId: 'acc_1',
        correlationId: '12345',
      });

      expect(token).toBeInstanceOf(VerifyTokenEntity);
    });

    it('returns default token when is called with unknown type', () => {
      const token = TokenFactory.get({
        type: 'unknown' as any,
        credentialId: 'cred_1',
        content: null,
        accountId: 'acc_1',
        correlationId: '12345',
      });

      expect(token).toBeInstanceOf(TokenEntity);
    });
  });
});
