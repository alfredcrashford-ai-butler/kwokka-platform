import { JwtUtil } from './jwt.util';

describe(JwtUtil, () => {
  it('exists', () => {
    expect(JwtUtil).toBeTruthy();
  });

  describe('sign()', () => {
    it('exists', () => {
      expect(JwtUtil.sign).toBeTruthy();
    });

    it('return a valid JWT token', () => {
      const payload = { userId: '123' };
      const secret = 'my-secret';
      const result = JwtUtil.sign(payload, secret);

      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
      expect(JwtUtil.parse(result)).toHaveProperty('userId', payload.userId);
    });
  });

  describe('verify()', () => {
    it('exists', () => {
      expect(JwtUtil.verify).toBeTruthy();
    });

    it('verifies correctly token with same secret', () => {
      const payload = { userId: '123' };
      const secret = 'my-secret';
      const jwt = JwtUtil.sign(payload, secret);

      const result = JwtUtil.verify(jwt, secret);

      expect(result).toBeTruthy();
      expect(result.userId).toEqual(payload.userId);
    });

    it('throws error when using invalid secret', () => {
      const payload = { userId: '123' };
      const secret = 'my-secret';
      const jwt = JwtUtil.sign(payload, secret);

      expect(() => JwtUtil.verify(jwt, 'other-secret')).toThrowError();
    });

    it('throws error when using invalid jwt', () => {
      const secret = 'my-secret';
      const jwt = 'invalid-jwt';

      expect(() => JwtUtil.verify(jwt, secret)).toThrowError();
    });
  });

  describe('parse()', () => {
    it('exists', () => {
      expect(JwtUtil.parse).toBeTruthy();
    });

    it('parses any jwt', () => {
      const payload = { userId: '123' };
      const secret1 = 'my-secret-1';
      const secret2 = 'my-secret-2';
      const jwt1 = JwtUtil.sign(payload, secret1);
      const jwt2 = JwtUtil.sign(payload, secret2);

      expect(JwtUtil.parse(jwt1)).toHaveProperty('userId', payload.userId);
      expect(JwtUtil.parse(jwt2)).toHaveProperty('userId', payload.userId);
    });

    it('returns undefined when using invalid jwt', () => {
      const jwt = 'invalid-jwt';
      expect(JwtUtil.parse(jwt)).toEqual(null);
    });
  });
});
