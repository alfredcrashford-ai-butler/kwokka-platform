import { DateUtil } from './date.util';

describe(DateUtil, () => {
  const offsetMs = new Date(1704069600000).getTimezoneOffset() * 60 * 1000;

  it('exists', () => {
    expect(DateUtil).toBeTruthy();
  });

  describe('format()', () => {
    it('exists', () => {
      expect(DateUtil.format).toBeInstanceOf(Function);
    });

    it('formats with provided format', () => {
      const d = new Date(1704069600000 + offsetMs);

      expect(DateUtil.format(d, 'YYYY.MM.DD')).toEqual('2024.01.01');
      expect(DateUtil.format(d, 'MM DD YY')).toEqual('01 01 24');
      expect(DateUtil.format(d, 'MM/DD HH:mm')).toEqual('01/01 00:40');
    });

    it('uses default format if format is not provided', () => {
      const d = new Date(1704069600000 + offsetMs);

      expect(DateUtil.format(d)).toEqual('01.01.2024 00:40');
      expect(DateUtil.format(d, null as never)).toEqual('01.01.2024 00:40');
    });
  });
});
