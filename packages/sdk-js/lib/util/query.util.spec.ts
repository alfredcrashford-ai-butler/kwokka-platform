import { QueryUtil } from './query.util';

describe(QueryUtil, () => {
  it('exists', () => {
    expect(QueryUtil).toBeTruthy();
  });

  describe('buildQuery()', () => {
    it('exists', () => {
      expect(QueryUtil.buildQuery).toBeTruthy();
    });

    it('returns empty string when queryObj is undefined', () => {
      expect(QueryUtil.buildQuery(undefined as any)).toBe('');
    });

    it('returns empty string when queryObj is null', () => {
      expect(QueryUtil.buildQuery(null as any)).toBe('');
    });

    it('returns empty string when queryObj is empty', () => {
      expect(QueryUtil.buildQuery({})).toBe('');
    });

    it('returns correct query string for sort only', () => {
      expect(QueryUtil.buildQuery({ sort: { name: 'asc' } })).toBe('?sort=name&order=asc');
    });

    it('returns correct query string for filter only', () => {
      expect(QueryUtil.buildQuery({ filter: { name: 'test' } })).toBe('?name=test');
    });

    it('returns correct query string for offset only', () => {
      expect(QueryUtil.buildQuery({ offset: 10 })).toBe('?offset=10');
    });

    it('returns correct query string for limit only', () => {
      expect(QueryUtil.buildQuery({ limit: 5 })).toBe('?limit=5');
    });

    it('returns correct query string for sort and filter', () => {
      expect(QueryUtil.buildQuery({ sort: { name: 'asc' }, filter: { age: 20 } })).toBe('?sort=name&order=asc&age=20');
    });

    it('returns correct query string for all parameters', () => {
      expect(
        QueryUtil.buildQuery({
          sort: { name: 'asc', age: 'desc' },
          filter: { status: 'active', ids: [1, 2] },
          offset: 10,
          limit: 20,
        }),
      ).toBe('?sort=name,age&order=asc,desc&status=active&ids=1,2&offset=10&limit=20');
    });

    it('skips undefined/null/empty parameters', () => {
      expect(
        QueryUtil.buildQuery({
          sort: undefined,
          filter: undefined,
          offset: undefined,
          limit: undefined,
        }),
      ).toBe('');
    });

    it('encodes keys and values in query string', () => {
      expect(
        QueryUtil.buildQuery({
          sort: { 'na me': 'asc' },
          filter: { 't est': 'v alue' },
        }),
      ).toBe('?sort=na%20me&order=asc&t%20est=v%20alue');
    });

    it('handles array and object filters', () => {
      expect(
        QueryUtil.buildQuery({
          filter: { ids: [1, 2, 3], obj: { a: { min: 1 } } },
        }),
      ).toBe('?ids=1,2,3&obj=%7B%22a%22%3A%7B%22min%22%3A1%7D%7D');
    });
  });

  describe('sortToUrl()', () => {
    it('exists', () => {
      expect(QueryUtil.sortToUrl).toBeTruthy();
    });

    it('returns empty string when sort is undefined', () => {
      expect(QueryUtil.sortToUrl(undefined as any)).toBe('');
    });

    it('returns empty string when sort is null', () => {
      expect(QueryUtil.sortToUrl(null as any)).toBe('');
    });

    it('returns empty string when sort is an empty object', () => {
      expect(QueryUtil.sortToUrl({})).toBe('');
    });

    it('returns correct query string for single sort key', () => {
      expect(QueryUtil.sortToUrl({ name: 'asc' })).toBe('sort=name&order=asc');
      expect(QueryUtil.sortToUrl({ age: 'desc' })).toBe('sort=age&order=desc');
    });

    it('returns correct query string for multiple sort keys', () => {
      expect(QueryUtil.sortToUrl({ name: 'asc', age: 'desc' })).toBe('sort=name,age&order=asc,desc');
    });

    it('skips keys with undefined or null values', () => {
      expect(QueryUtil.sortToUrl({ a: undefined as any, b: null as any, c: 'asc' })).toBe('sort=c&order=asc');
    });

    it('encodes sort keys', () => {
      expect(QueryUtil.sortToUrl({ 'na me': 'asc', 'a&b': 'desc' })).toBe('sort=na%20me,a%26b&order=asc,desc');
    });
  });

  describe('filterToUrl()', () => {
    it('exists', () => {
      expect(QueryUtil.filterToUrl).toBeTruthy();
    });

    it('returns empty string when filter is undefined', () => {
      expect(QueryUtil.filterToUrl(undefined as any)).toBe('');
    });

    it('returns empty string when filter is null', () => {
      expect(QueryUtil.filterToUrl(null as any)).toBe('');
    });

    it('returns empty string when filter is an empty object', () => {
      expect(QueryUtil.filterToUrl({})).toBe('');
    });

    it('returns correct query string for single string filter', () => {
      expect(QueryUtil.filterToUrl({ name: 'test' })).toBe('name=test');
    });

    it('returns correct query string for single number filter', () => {
      expect(QueryUtil.filterToUrl({ age: 25 })).toBe('age=25');
    });

    it('returns correct query string for array of numbers', () => {
      expect(QueryUtil.filterToUrl({ ids: [1, 2, 3] })).toBe('ids=1,2,3');
    });

    it('returns correct query string for array of strings', () => {
      expect(QueryUtil.filterToUrl({ tags: ['a', 'b', 'c'] })).toBe('tags=a,b,c');
    });

    it('encodes keys and values', () => {
      expect(QueryUtil.filterToUrl({ 'na me': 't est' })).toBe('na%20me=t%20est');
    });

    it('skips undefined and null values', () => {
      expect(QueryUtil.filterToUrl({ a: undefined as any, b: null as any, c: 1 })).toBe('c=1');
    });

    it('handles multiple filters', () => {
      expect(QueryUtil.filterToUrl({ a: 1, b: 'two', c: [3, 4] })).toBe('a=1&b=two&c=3,4');
    });

    it('stringifies objects (e.g. DeepSearchParameter)', () => {
      const obj = { params: { age: { min: 18 } } };
      expect(QueryUtil.filterToUrl({ filter: obj })).toBe(
        'filter=%7B%22params%22%3A%7B%22age%22%3A%7B%22min%22%3A18%7D%7D%7D',
      );
    });
  });

  describe('offsetToUrl()', () => {
    it('exists', () => {
      expect(QueryUtil.offsetToUrl).toBeTruthy();
    });

    it('returns correct query string for a valid offset', () => {
      expect(QueryUtil.offsetToUrl(5)).toBe('offset=5');
      expect(QueryUtil.offsetToUrl(0)).toBe('offset=0');
      expect(QueryUtil.offsetToUrl(100)).toBe('offset=100');
    });

    it('returns empty string for undefined offset', () => {
      expect(QueryUtil.offsetToUrl(undefined as any)).toBe('');
    });

    it('returns empty string for null offset', () => {
      expect(QueryUtil.offsetToUrl(null as any)).toBe('');
    });

    it('returns empty string for non-number offset', () => {
      expect(QueryUtil.offsetToUrl('5' as any)).toBe('');
      expect(QueryUtil.offsetToUrl({} as any)).toBe('');
      expect(QueryUtil.offsetToUrl([] as any)).toBe('');
    });
  });

  describe('limitToUrl()', () => {
    it('exists', () => {
      expect(QueryUtil.limitToUrl).toBeTruthy();
    });

    it('returns correct query string for a valid limit', () => {
      expect(QueryUtil.limitToUrl(10)).toBe('limit=10');
      expect(QueryUtil.limitToUrl(0)).toBe('limit=0');
      expect(QueryUtil.limitToUrl(100)).toBe('limit=100');
    });

    it('returns empty string for undefined limit', () => {
      expect(QueryUtil.limitToUrl(undefined as any)).toBe('');
    });

    it('returns empty string for null limit', () => {
      expect(QueryUtil.limitToUrl(null as any)).toBe('');
    });

    it('returns empty string for non-number limit', () => {
      expect(QueryUtil.limitToUrl('10' as any)).toBe('');
      expect(QueryUtil.limitToUrl({} as any)).toBe('');
      expect(QueryUtil.limitToUrl([] as any)).toBe('');
    });
  });
});
