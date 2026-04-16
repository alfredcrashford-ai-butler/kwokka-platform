import { NumberUtil } from './number.util';

describe(NumberUtil, () => {
  it('exists', () => {
    expect(NumberUtil).toBeTruthy();
  });

  describe('factorial()', () => {
    it('exists', () => {
      expect(NumberUtil.factorial).toBeInstanceOf(Function);
    });

    it('calculates factorial correctly', () => {
      expect(NumberUtil.factorial(10)).toEqual(3628800);
      expect(NumberUtil.factorial(11)).toEqual(39916800);
      expect(NumberUtil.factorial(12)).toEqual(479001600);
      expect(NumberUtil.factorial(20)).toEqual(2432902008176640000);
      expect(NumberUtil.factorial(100)).toEqual(9.33262154439441e157);
      expect(NumberUtil.factorial(160)).toEqual(4.714723635992059e284);
      expect(NumberUtil.factorial(200)).toEqual(Infinity);
      expect(NumberUtil.factorial(2000)).toEqual(Infinity);
    });
  });

  describe('getCombinationsCount()', () => {
    it('exists', () => {
      expect(NumberUtil.getCombinationsCount).toBeInstanceOf(Function);
    });

    it('calculates combinations correctly', () => {
      expect(NumberUtil.getCombinationsCount(5, 2)).toEqual(10);
      expect(NumberUtil.getCombinationsCount(6, 2)).toEqual(15);
      expect(NumberUtil.getCombinationsCount(20, 2)).toEqual(190);
    });
  });

  describe('minmax()', () => {
    it('exists', () => {
      expect(NumberUtil.minmax).toBeInstanceOf(Function);
    });

    it('normalizes with minmax', () => {
      expect(NumberUtil.minmax(10, 0, 20, -50, 50)).toEqual(0);
    });
  });

  describe('clamp()', () => {
    it('exists', () => {
      expect(NumberUtil.clamp).toBeInstanceOf(Function);
    });

    it('returns min value when first argument is lower or equal to min value', () => {
      expect(NumberUtil.clamp(0, 0, 100)).toEqual(0);
      expect(NumberUtil.clamp(-1, 0, 100)).toEqual(0);
      expect(NumberUtil.clamp(-Infinity, 0, 100)).toEqual(0);
      expect(NumberUtil.clamp(-0.00001, 0, 100)).toEqual(0);
    });

    it('returns max value when first argument is greater or equal to min value', () => {
      expect(NumberUtil.clamp(100, 0, 100)).toEqual(100);
      expect(NumberUtil.clamp(101, 0, 100)).toEqual(100);
      expect(NumberUtil.clamp(Infinity, 0, 100)).toEqual(100);
      expect(NumberUtil.clamp(100.00001, 0, 100)).toEqual(100);
    });

    it('returns first argument if it is in range of min and max', () => {
      expect(NumberUtil.clamp(50, 0, 100)).toEqual(50);
    });
  });

  describe('mean()', () => {
    it('exists', () => {
      expect(NumberUtil.mean).toBeInstanceOf(Function);
    });

    it('returns 0 if array is empty', () => {
      expect(NumberUtil.mean([])).toEqual(0);
    });

    it('returns 0 if input is not array', () => {
      expect(NumberUtil.mean(null as any)).toEqual(0);
      expect(NumberUtil.mean(undefined as any)).toEqual(0);
      expect(NumberUtil.mean({} as any)).toEqual(0);
    });

    it('correctly calculated mean', () => {
      expect(NumberUtil.mean([100, 200, 300, 400, 500])).toEqual(300);
    });
  });
});
