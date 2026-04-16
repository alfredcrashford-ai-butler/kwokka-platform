import { Request } from 'express';

export class RequestQueryUtil {
  public static parseOffset(req: Request): number {
    return this.parseIntQueryParam(req, 'offset', 0);
  }

  public static parseLimit(req: Request): number {
    return this.parseIntQueryParam(req, 'limit', 50);
  }

  public static parseStringQueryParam(req: Request, paramName: string, defaultValue: string = undefined): string {
    const originalValue = req.query[paramName];
    const stringValue = (Array.isArray(originalValue) ? originalValue[0] : originalValue) as string;
    return stringValue !== undefined && stringValue !== null ? `${stringValue}` : defaultValue;
  }

  public static parseStringArrayQueryParam(
    req: Request,
    paramName: string,
    defaultValue: string[] = undefined,
  ): string[] {
    const originalValue = req.query[paramName];
    if (!originalValue) {
      return defaultValue;
    }

    let arrayValue = (Array.isArray(originalValue) ? originalValue : [originalValue]) as string[];
    if (typeof originalValue === 'string' && originalValue.split(',').length > 1) {
      arrayValue = originalValue.split(',');
    }

    if (!arrayValue.length) {
      return defaultValue;
    }

    if (arrayValue.length === 1 && (arrayValue[0] === null || arrayValue[0] === undefined)) {
      return defaultValue;
    }

    return arrayValue.map(el => el !== null && el !== undefined ? `${el}` : el);
  }

  public static parseIntQueryParam(req: Request, paramName: string, defaultValue: number = undefined): number {
    const stringValue = this.parseStringQueryParam(req, paramName);

    if (stringValue === undefined || stringValue === null) {
      return defaultValue;
    }

    try {
      const result = Number.parseInt(stringValue, 10);
      return isNaN(result) ? defaultValue : result;
    } catch (error: unknown) {
      return defaultValue;
    }
  }
}
