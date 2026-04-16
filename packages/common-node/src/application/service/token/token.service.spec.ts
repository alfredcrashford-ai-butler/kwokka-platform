import { ConfigService } from '../config';
import { TokenService } from './token.service';

describe(TokenService, () => {
  let service: TokenService;
  let configService: ConfigService;

  beforeEach(async () => {
    configService = new ConfigService();
    jest.spyOn(configService, 'get').mockReturnValue('test');
    service = new TokenService(configService);
  });

  it('exists', () => {
    expect(TokenService).toBeTruthy();
  });

  describe('sign()', () => {
    it('exists', () => {
      expect(service.sign).toBeTruthy();
    });

    it('generates a string token', () => {
      const jwt = service.sign({ data: { a: 'a' } });
      expect(typeof jwt).toBe('string');
    });
  });

  describe('verify()', () => {
    it('exists', () => {
      expect(service.verify).toBeTruthy();
    });

    it('returns encoded data in the provided jwt', () => {
      const jwt = service.sign({ data: { a: 'a' } });
      const result: any = service.verify(jwt);
      expect(result.data).toEqual({ a: 'a' });
    });

    it('returns null when provided with a non-jwt string', () => {
      expect(service.verify('non-jwt')).toEqual(null);
    });
  });
});
