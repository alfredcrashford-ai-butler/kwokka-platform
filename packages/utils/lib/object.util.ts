export class ObjectUtil {
  public static clone(original: object) {
    if (original === undefined) {
      return undefined;
    }

    return JSON.parse(JSON.stringify(original));
  }

  public static take(obj: any, fields: string[]) {
    if (typeof obj !== 'object' || !obj) {
      return obj;
    }

    const newObj: any = {};
    fields.forEach((el) => obj && obj[el] !== undefined && (newObj[el] = obj[el]));
    return newObj;
  }

  public static mapDeep(obj: any, fn: (...v: any[]) => any): any {
    if (Array.isArray(obj)) {
      return obj.map((item) => ObjectUtil.mapDeep(item, fn));
    } else if (obj !== null && typeof obj === 'object') {
      return Object.keys(obj).reduce((acc: any, key: any) => {
        acc[key] = ObjectUtil.mapDeep(obj[key], fn);
        return acc;
      }, {});
    } else {
      return fn(obj);
    }
  }
}
