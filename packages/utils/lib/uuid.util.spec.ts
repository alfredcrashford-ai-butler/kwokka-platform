import { UuidUtil } from './uuid.util';

describe(UuidUtil, () => {
  it('exists', () => {
    expect(UuidUtil).toBeTruthy();
  });

  describe('generate()', () => {
    it('exists', () => {
      expect(UuidUtil.generate).toBeInstanceOf(Function);
    });

    it('generates unique ids', () => {
      expect(UuidUtil.generate(8)).not.toEqual(UuidUtil.generate(8));
    });

    it('generates 32 characters by default', () => {
      expect(UuidUtil.generate().length).toEqual(32);
    });
  });

  describe('generateNumeric()', () => {
    it('exists', () => {
      expect(UuidUtil.generateNumeric).toBeInstanceOf(Function);
    });

    it('returns only numbers', () => {
      expect(UuidUtil.generateNumeric(32)).not.toMatch(/[A-Za-z]+/);
    });
  });

  describe('generateNoSpecialSymbols()', () => {
    it('exists', () => {
      expect(UuidUtil.generateNoSpecialSymbols).toBeInstanceOf(Function);
    });

    it('does not generate special symbols', () => {
      expect(UuidUtil.generateNoSpecialSymbols(32)).toMatch(/^[A-Za-z0-9]+$/);
    });
  });
});
