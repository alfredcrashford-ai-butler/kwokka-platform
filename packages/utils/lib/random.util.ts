import { NumberUtil } from './number.util';

export class RandomUtil {
  public static randomInArray<T>(array: T[]): T | null {
    if (!array || !array.length) {
      return null;
    }

    return this.weightedRandomInArray(array.map((el) => [1, el]));
  }

  public static weightedRandomInArray<T>(array: [number, T][]): T | null {
    if (!array || !array.length) {
      return null;
    }

    const weightsSum = array.map(el => el[0]).reduce((sum, v) => sum + v, 0);
    const normalizedRandomNumber = NumberUtil.minmax(Math.random(), 0, 1, 0, weightsSum);

    let prevResult = 0;

    for (let i = 0; i < array.length; i++) {
      const [weight, result] = array[i];

      const isRNMoreThanPrev = normalizedRandomNumber >= prevResult;
      const isRNLessThanNext = normalizedRandomNumber < prevResult + weight;

      if (isRNMoreThanPrev && isRNLessThanNext) {
        return result
      }

      prevResult += weight;
    }

    return null
  }

  public static randomInRange(min: number, max: number): number {
    return Math.random() * (max - min) + min;
  }

  public static randomIntegerInRange(min: number, max: number): number {
    const intMin = Math.ceil(min);
    const intMax = Math.floor(max);
    return Math.floor(this.randomInRange(intMin, intMax));
  }
}
