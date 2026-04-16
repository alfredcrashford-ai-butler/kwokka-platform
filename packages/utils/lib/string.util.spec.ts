import { StringUtil } from './string.util';

describe(StringUtil, () => {
  it('exists', () => {
    expect(StringUtil).toBeTruthy();
  });

  describe('format()', () => {
    it('exists', () => {
      expect(StringUtil.format).toBeInstanceOf(Function);
    });

    it('inserts values from an object into string', () => {
      const string = 'Hello {{firstName}} {{lastName}}';
      const object = { firstName: 'John', lastName: 'Doe' };
      const expected = 'Hello John Doe';

      expect(StringUtil.format(string, object)).toEqual(expected);
    });

    it('does not insert missing keys', () => {
      const string = 'Hello {{firstName}} {{lastName}}';
      const object = { firstName: 'John' };
      const expected = 'Hello John {{lastName}}';

      expect(StringUtil.format(string, object)).toEqual(expected);
    });

    it('does not change string when passing empty object', () => {
      const string = 'Hello {{firstName}} {{lastName}}';
      const object = null;

      expect(StringUtil.format(string, object)).toEqual(string);
    });
  });
});
