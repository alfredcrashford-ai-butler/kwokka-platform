export class NumberUtil {
  public static factorial(n: number): number {
    let result = 1;
    for (let i = 2; i <= n; i++) {
      result *= i;
    }
    return result;
  }

  public static getCombinationsCount(n: number, k: number): number {
    const nFact = this.factorial(n);
    const kFact = this.factorial(k);
    const nkFact = this.factorial(n - k);
    return nFact / (kFact * nkFact);
  }

  public static minmax(v: number, min: number, max: number, newMin: number, newMax: number): number {
    return ((v - min) / (max - min)) * (newMax - newMin) + newMin;
  }

  public static clamp(v: number, min: number, max: number): number {
    return Math.max(Math.min(v, max), min);
  }

  public static mean(arr: number[]): number {
    if (!Array.isArray(arr)) return 0;
    if (arr.length === 0) return 0;
    const sum = arr.reduce((acc, val) => acc + val, 0);
    return sum / arr.length;
  }
}
