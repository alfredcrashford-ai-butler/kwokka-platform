import { DeepSearchParameter } from '../deep-search-parameter';

export type QuerySortOption = 'asc' | 'desc';

export interface QueryListMetadata {
  offset?: number;
  limit?: number;
  count?: number;
}

export type QueryListDto<T> = {
  data: T[];
  meta?: QueryListMetadata;
};

export class QueryUtil {
  public static buildQuery(queryObj: {
    sort?: Record<string, QuerySortOption>;
    filter?: Record<string, number | string | number[] | string[] | DeepSearchParameter>;
    offset?: number;
    limit?: number;
  }): string {
    let query = '';

    if (!queryObj) {
      return query;
    }

    const sort = QueryUtil.sortToUrl(queryObj.sort);
    const filter = QueryUtil.filterToUrl(queryObj.filter);
    const offset = QueryUtil.offsetToUrl(queryObj.offset);
    const limit = QueryUtil.limitToUrl(queryObj.limit);

    query = [sort, filter, offset, limit].filter(Boolean).join('&');

    return query ? `?${query}` : '';
  }

  public static sortToUrl(sort: Record<string, QuerySortOption>): string {
    if (!sort) {
      return '';
    }

    const sortKeys = [];
    const sortOrders = [];
    Object.keys(sort || {}).forEach((key) => {
      if (sort?.[key]) {
        sortKeys.push(encodeURIComponent(key));
        sortOrders.push(encodeURIComponent(sort?.[key]));
      }
    });
    return sortKeys.length ? `sort=${sortKeys.join(',')}&order=${sortOrders.join(',')}` : '';
  }

  public static filterToUrl(
    filter: Record<string, number | string | number[] | string[] | DeepSearchParameter>,
  ): string {
    if (!filter) {
      return '';
    }

    const params: string[] = [];
    Object.entries(filter).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        params.push(`${encodeURIComponent(key)}=${value.map((v) => encodeURIComponent(v)).join(',')}`);
      } else if (typeof value === 'object' && value !== null) {
        params.push(`${encodeURIComponent(key)}=${encodeURIComponent(JSON.stringify(value))}`);
      } else if (value !== undefined && value !== null) {
        params.push(`${encodeURIComponent(key)}=${encodeURIComponent(value as any)}`);
      }
    });
    return params.join('&');
  }

  public static offsetToUrl(offset: number): string {
    return typeof offset === 'number' ? `offset=${offset}` : '';
  }

  public static limitToUrl(limit: number): string {
    return typeof limit === 'number' ? `limit=${limit}` : '';
  }
}
