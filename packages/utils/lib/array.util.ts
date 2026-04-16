export class ArrayUtil {
  public static shuffle<T>(array: T[]): T[] {
    if (!array || !array.length) {
      return array;
    }

    const result = [...array];

    let m = array.length;
    let t;
    let i;

    while (m) {
      // Pick a remaining element…
      i = Math.floor(Math.random() * m--);

      // And swap it with the current element.
      t = result[m];
      result[m] = result[i];
      result[i] = t;
    }

    return result;
  }

  public static includesAny<T>(source: T[], target: T[]): boolean {
    if (!source?.length) {
      return false;
    }
    if (!target?.length) {
      return false;
    }
    return source.some((el) => target.includes(el));
  }

  public static first<T = any>(maybeArray: T | T[]): T {
    return Array.isArray(maybeArray) ? maybeArray[0] : maybeArray;
  }

  public static compareContent(a: any[], b: any[]): boolean {
    if (a.length !== b.length) {
      return false;
    }

    if (a === b) {
      return true;
    }

    if (!a.every((el) => b.includes(el))) {
      return false;
    }

    return true;
  }

  public static compare(a: any[], b: any[]): boolean {
    if (a.length !== b.length) {
      return false;
    }

    if (a === b) {
      return true;
    }

    for (let i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) {
        return false
      }
    }

    return true;
  }
}
