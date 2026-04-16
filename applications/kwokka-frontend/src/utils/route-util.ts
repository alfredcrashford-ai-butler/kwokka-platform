import { ArrayUtil } from '@kwokka/utils';

export class RouteUtil {
  public static getQueryParam(singularOrPluralParam: string | string[]): string {
    return Array.isArray(singularOrPluralParam) ? ArrayUtil.first(singularOrPluralParam) : singularOrPluralParam;
  }
}
