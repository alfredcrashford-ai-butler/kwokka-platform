import crypto from 'crypto';
import { ScryptHashUtil } from './scrypt-hash.util';

describe(ScryptHashUtil, () => {
  it('exists', () => {
    expect(ScryptHashUtil).toBeTruthy();
  });

  describe('hash()', () => {
    it('exists', () => {
      expect(ScryptHashUtil.hash).toBeTruthy();
    });

    it('hashes given string content', async () => {
      const content = 'hello world';
      const hash = await ScryptHashUtil.hash(content);
      expect(hash).not.toEqual(content);
    });

    it('produces hash with hashed content and salt', async () => {
      const content = 'hello world';
      const hash = await ScryptHashUtil.hash(content);
      expect(hash).toContain(':');
    });

    it('rejects with error if called with object content', () => {
      const content = { message: 'hello world' } as any;
      expect(ScryptHashUtil.hash(content)).rejects.toBeTruthy();
    });

    it('rejects with error if err is returned in callback', () => {
      const spy = jest.spyOn(crypto, 'scrypt').mockImplementation((_a, _b, _c, callback: any) => {
        callback('error');
      });
      const content = 'hello world';
      expect(ScryptHashUtil.hash(content)).rejects.toEqual('error');
      spy.mockRestore();
    });
  });

  describe('verify()', () => {
    it('exists', () => {
      expect(ScryptHashUtil.verify).toBeTruthy();
    });

    it('returns true when the content hash is equal to provided hash', async () => {
      const content = 'hello world';
      const hash = await ScryptHashUtil.hash(content);
      expect(await ScryptHashUtil.verify(hash, content)).toEqual(true);
    });

    it('returns false when the content hash is different from provided hash', async () => {
      const content = 'hello world';
      const hash = await ScryptHashUtil.hash(content);
      expect(await ScryptHashUtil.verify(hash, 'hello darkness')).toEqual(false);
    });

    it('rejects with error if err is returned in callback', () => {
      const spy = jest.spyOn(crypto, 'scrypt').mockImplementation((_a, _b, _c, callback: any) => {
        callback('error');
      });
      const content = 'hello world';
      expect(ScryptHashUtil.verify('hash', content)).rejects.toEqual('error');
      spy.mockRestore();
    });
  });
});
