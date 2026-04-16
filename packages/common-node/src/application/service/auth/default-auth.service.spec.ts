import { DefaultAuthService } from './default-auth.service';
import { LoggerServiceMock } from '../../../../test/__mocks__';
import { JwtUtil } from '../../../util';
import { TokenEntityType } from '@kwokka/entities';

describe(DefaultAuthService, () => {
  const unauthenticatedInfo = { isAuthenticated: false, account: null, token: null };
  let authService: DefaultAuthService;

  beforeEach(() => {
    authService = new DefaultAuthService(new LoggerServiceMock());
  });

  it('exists', () => {
    expect(DefaultAuthService).toBeTruthy();
  });

  describe('getAuthInfo()', () => {
    it('returns unauthenticated info if tokenOrAuthHeader is not a string', async () => {
      expect(await authService.getAuthInfo(999 as any)).toEqual(unauthenticatedInfo);
      expect(await authService.getAuthInfo(null as any)).toEqual(unauthenticatedInfo);
      expect(await authService.getAuthInfo(undefined as any)).toEqual(unauthenticatedInfo);
    });

    it('returns unauthenticated info if tokenOrAuthHeader is a string that contains only "Bearer "', async () => {
      expect(await authService.getAuthInfo('Bearer ')).toEqual(unauthenticatedInfo);
    });

    it('returns unauthenticated info if tokenOrAuthHeader is a string that contains only "Bearer "', async () => {
      expect(await authService.getAuthInfo('Bearer THIS.IS.NOTJWT')).toEqual(unauthenticatedInfo);
    });

    it('returns unauthenticated info if token is expired', async () => {
      const content = { type: TokenEntityType.Access, accountId: 'accountId', jti: 'jti', exp: Date.now() - 10000 };
      const tokenStr = JwtUtil.sign(content, 'secret');
      expect(await authService.getAuthInfo(tokenStr)).toEqual(unauthenticatedInfo);
    });

    it('returns unauthenticated info if token is not of access type', async () => {
      const content = { type: TokenEntityType.Verify, accountId: 'accountId', jti: 'jti', exp: Date.now() + 10000 };
      const tokenStr = JwtUtil.sign(content, 'secret');

      const result = await authService.getAuthInfo(tokenStr);

      expect(result).toEqual(unauthenticatedInfo);
    });

    it('returns unauthenticated info if token is revoked', async () => {
      const content = { type: TokenEntityType.Access, accountId: 'accountId', jti: 'jti', exp: Date.now() + 10000 };
      const tokenStr = JwtUtil.sign(content, 'secret');
      const originalGetToken = authService['getToken'];
      authService['getToken'] = async (...args) => {
        const token = await originalGetToken(...args);
        token.revokedAt = new Date();
        return token;
      };

      const result = await authService.getAuthInfo(tokenStr);

      expect(result).toEqual(unauthenticatedInfo);
    });

    it('returns unauthenticated info if account id is not provided', async () => {
      const content = { type: TokenEntityType.Access, jti: 'jti', exp: Date.now() + 10000 };
      const tokenStr = JwtUtil.sign(content, 'secret');

      const result = await authService.getAuthInfo(tokenStr);

      expect(result).toEqual(unauthenticatedInfo);
    });

    it('returns unauthenticated info if account id is not provided', async () => {
      const content = { type: TokenEntityType.Access, jti: 'jti', exp: Date.now() + 10000 };
      const tokenStr = JwtUtil.sign(content, 'secret');

      const result = await authService.getAuthInfo(tokenStr);

      expect(result).toEqual(unauthenticatedInfo);
    });

    it('returns unauthenticated info if error is raised during execution', async () => {
      const content = { type: TokenEntityType.Access, accountId: 'accountId', jti: 'jti', exp: Date.now() + 10000 };
      const tokenStr = JwtUtil.sign(content, 'secret');
      authService['getAccount'] = jest.fn().mockRejectedValue(new Error());

      const result = await authService.getAuthInfo(tokenStr);

      expect(result).toEqual(unauthenticatedInfo);
    });

    it('returns authenticated info for expired token if skipExpiryCheck flag is true', async () => {
      const content = { type: TokenEntityType.Access, accountId: 'accountId', jti: 'jti', exp: Date.now() - 10000 };
      const tokenStr = JwtUtil.sign(content, 'secret');

      const result = await authService.getAuthInfo(tokenStr, { skipExpiryCheck: true, skipRevokeCheck: false });

      expect(result.isAuthenticated).toEqual(true);
    });

    it('returns authenticated info for revoked token if skipRevokeCheck flag is true', async () => {
      const content = { type: TokenEntityType.Access, accountId: 'accountId', jti: 'jti', exp: Date.now() + 10000 };
      const tokenStr = JwtUtil.sign(content, 'secret');
      const originalGetToken = authService['getToken'];
      authService['getToken'] = async (...args) => {
        const token = await originalGetToken(...args);
        token.revokedAt = new Date();
        return token;
      };

      const result = await authService.getAuthInfo(tokenStr, { skipExpiryCheck: false, skipRevokeCheck: true });

      expect(result.isAuthenticated).toEqual(true);
    });

    it('returns authenticated info if token is correct', async () => {
      const content = { type: TokenEntityType.Access, accountId: 'accountId', jti: 'jti', exp: Date.now() + 10000 };
      const tokenStr = JwtUtil.sign(content, 'secret');

      const result = await authService.getAuthInfo(tokenStr);

      expect(result.isAuthenticated).toEqual(true);
    });
  });
});
