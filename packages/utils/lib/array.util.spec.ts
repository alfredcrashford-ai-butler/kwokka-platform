import { ArrayUtil } from './array.util';

describe(ArrayUtil, () => {
  it('exists', () => {
    expect(ArrayUtil).toBeTruthy();
  });

  describe('shuffle()', () => {
    it('exists', () => {
      expect(ArrayUtil.shuffle).toBeInstanceOf(Function);
    });

    it('returns same value if called with empty array or falsy array value', () => {
      expect(ArrayUtil.shuffle(null as never)).toEqual(null);
      expect(ArrayUtil.shuffle([])).toEqual([]);
    });

    it('returns array of same size', () => {
      const arr = [1, 2, 3];
      expect(ArrayUtil.shuffle(arr).length).toEqual(arr.length);
    });

    it('returns array with same content', () => {
      const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      const result = ArrayUtil.shuffle(arr);

      expect(ArrayUtil.compareContent(arr, result)).toEqual(true);
    });
  });

  describe('includesAny()', () => {
    it('exists', () => {
      expect(ArrayUtil.includesAny).toBeInstanceOf(Function);
    });

    it('returns true for intersecting arrays', () => {
      expect(ArrayUtil.includesAny([1, 2, 3], [3, 4, 5])).toEqual(true);
    });

    it('returns false for non-intersecting arrays', () => {
      expect(ArrayUtil.includesAny([1, 2, 3], [4, 5, 6])).toEqual(false);
    });

    it('returns false if one of arrays os empty', () => {
      expect(ArrayUtil.includesAny(null as never, [4, 5, 6])).toEqual(false);
      expect(ArrayUtil.includesAny([], [4, 5, 6])).toEqual(false);
      expect(ArrayUtil.includesAny([1, 2, 3], null as never)).toEqual(false);
      expect(ArrayUtil.includesAny([1, 2, 3], [])).toEqual(false);
    });
  });

  describe('first()', () => {
    it('exists', () => {
      expect(ArrayUtil.first).toBeInstanceOf(Function);
    });

    it('returns same value if called with non-array value', () => {
      expect(ArrayUtil.first(3)).toEqual(3);
    });

    it('returns first element of array', () => {
      expect(ArrayUtil.first([1, 2, 3])).toEqual(1);
    });

    it('returns undefined for empty array', () => {
      expect(ArrayUtil.first([])).toEqual(undefined);
    });
  });

  describe('compareContent()', () => {
    it('exists', () => {
      expect(ArrayUtil.compareContent).toBeInstanceOf(Function);
    });

    it('returns true for two empty arrays', () => {
      expect(ArrayUtil.compareContent([], [])).toEqual(true);
    });

    it('returns true for same array', () => {
      const arr = [1, 2, 3];
      expect(ArrayUtil.compareContent(arr, arr)).toEqual(true);
    });

    it('returns true for identical arrays', () => {
      expect(ArrayUtil.compareContent([1, 2, 3], [1, 2, 3])).toEqual(true);
    });

    it('returns true for arrays with same content but different order', () => {
      expect(ArrayUtil.compareContent([1, 3, 2], [1, 2, 3])).toEqual(true);
    });

    it('returns false for arrays with different content', () => {
      expect(ArrayUtil.compareContent([1, 2, 4], [1, 2, 3])).toEqual(false);
    });

    it('returns false for arrays with different size', () => {
      expect(ArrayUtil.compareContent([1, 2], [1, 2, 3])).toEqual(false);
    });
  });

  describe('compare()', () => {
    it('exists', () => {
      expect(ArrayUtil.compare).toBeInstanceOf(Function);
    });

    it('returns true for two empty arrays', () => {
      expect(ArrayUtil.compare([], [])).toEqual(true);
    });

    it('returns true for same array', () => {
      const arr = [1, 2, 3];
      expect(ArrayUtil.compare(arr, arr)).toEqual(true);
    });

    it('returns true for identical arrays', () => {
      expect(ArrayUtil.compare([1, 2, 3], [1, 2, 3])).toEqual(true);
    });

    it('returns false for arrays with same content but different order', () => {
      expect(ArrayUtil.compare([1, 3, 2], [1, 2, 3])).toEqual(false);
    });

    it('returns false for arrays with different size', () => {
      expect(ArrayUtil.compare([1, 2], [1, 2, 3])).toEqual(false);
    });
  });
});
