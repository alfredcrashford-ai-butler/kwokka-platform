import { RandomUtil } from './random.util';

describe(RandomUtil, () => {
  it('exists', () => {
    expect(RandomUtil).toBeTruthy();
  });

  describe('randomInArray()', () => {
    it('exists', () => {
      expect(RandomUtil.randomInArray).toBeInstanceOf(Function);
    });

    it('returns null for empty array', () => {
      expect(RandomUtil.randomInArray([])).toEqual(null);
    });

    it('returns null for falsy array value', () => {
      expect(RandomUtil.randomInArray(null as never)).toEqual(null);
    });

    it('returns value from given array', () => {
      const array = [1, 2, 3];

      expect(array).toContain(RandomUtil.randomInArray(array));
    });
  });

  describe('weightedRandomInArray()', () => {
    it('exists', () => {
      expect(RandomUtil.weightedRandomInArray).toBeInstanceOf(Function);
    });

    it('returns null for empty array', () => {
      expect(RandomUtil.weightedRandomInArray([])).toEqual(null);
    });

    it('returns null for falsy array value', () => {
      expect(RandomUtil.weightedRandomInArray(null as never)).toEqual(null);
    });

    it('returns value from given array', () => {
      const array = [1, 2, 3];
      const weightedArray: [number, number][] = [
        [1, array[0]],
        [1, array[1]],
        [1, array[2]],
      ];

      expect(array).toContain(RandomUtil.weightedRandomInArray(weightedArray));
    });

    it('always returns overwheight value', () => {
      const array = [1, 2, 3];
      const weightedArray: [number, number][] = [
        [1, array[0]],
        [0, array[1]],
        [0, array[2]],
      ];

      expect(RandomUtil.weightedRandomInArray(weightedArray)).toEqual(array[0]);
    });

    it('returns null if random becomes crazy', () => {
      const array = [1, 2, 3];
      const weightedArray: [number, number][] = [
        [1, array[0]],
        [0, array[1]],
        [0, array[2]],
      ];
      const spy = jest.spyOn(Math, 'random').mockReturnValue(1.5);

      expect(RandomUtil.weightedRandomInArray(weightedArray)).toEqual(null);
      spy.mockRestore();
    });
  });

  describe('randomInRange()', () => {
    it('exists', () => {
      expect(RandomUtil.randomInRange).toBeInstanceOf(Function);
    });

    it('returns value in given range', () => {
      const min = 10;
      const max = 20;

      expect(RandomUtil.randomInRange(min, max)).toBeLessThanOrEqual(max);
      expect(RandomUtil.randomInRange(min, max)).toBeGreaterThanOrEqual(min);
    });
  });

  describe('randomIntegerInRange()', () => {
    it('exists', () => {
      expect(RandomUtil.randomIntegerInRange).toBeInstanceOf(Function);
    });

    it('returns integer', () => {
      const min = 10;
      const max = 20;

      const result = RandomUtil.randomIntegerInRange(min, max);

      expect(Number.isInteger(result)).toEqual(true);
    });

    it('returns value in given range', () => {
      const min = 10;
      const max = 20;

      expect(RandomUtil.randomIntegerInRange(min, max)).toBeLessThanOrEqual(max);
      expect(RandomUtil.randomIntegerInRange(min, max)).toBeGreaterThanOrEqual(min);
    });
  });
});
