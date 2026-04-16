import { Model, Types } from 'mongoose';
import { AccountEntity } from '@kwokka/entities';
import { Adapter } from '@kwokka/utils';
import { MongoRepository } from './mongo-repository';
import { MongoDTO } from './mongo-dto';

class TestAdapter extends Adapter<AccountEntity, MongoDTO<AccountEntity>> {
  public override deserialize = jest.fn();
  public override serialize = jest.fn();
}

class TestImpl extends MongoRepository<AccountEntity> {
  public readonly adapter = new TestAdapter();
  public readonly model: Model<any> = {} as any;
}

describe(MongoRepository, () => {
  let repo: TestImpl;

  beforeEach(() => {
    repo = new TestImpl();
  });

  it('exists', () => {
    expect(MongoRepository).toBeTruthy();
  });

  describe('formatFilter()', () => {
    it('exists', () => {
      expect(repo['formatFilter']).toBeTruthy();
    });

    it('adds deletedAt to the filter', () => {
      const result = repo['formatFilter']({});
      expect(result).toEqual({ deletedAt: null });
    });

    it('does not change empty filter', () => {
      const result = repo['formatFilter']({});
      expect(result).toEqual({ deletedAt: null });
    });

    it('removes undefined from the filter', () => {
      const result = repo['formatFilter']({ type: undefined as any });
      expect(result).toEqual({ deletedAt: null });
      expect(result.type).not.toBeDefined();
    });

    it('switches id to _id', () => {
      const result = repo['formatFilter']({ id: '12345' });
      expect(result).toEqual({ _id: '12345', deletedAt: null });
    });

    it('converts ObjectId-like strings to actual ObjectId objects', () => {
      const result = repo['formatFilter']({ gameId: '672b9c0b2e25d8013c853dbf' });
      expect(result.gameId).toBeInstanceOf(Types.ObjectId);
    });
  });

  describe('convertUsecaseDeepSearchParameter()', () => {
    it('exists', () => {
      expect(repo['convertUsecaseDeepSearchParameter']).toBeTruthy();
    });

    it('should convert min and max to $gte and $lte', () => {
      const filter = { param: { age: { min: 18, max: 30 } } };
      const output = repo['convertUsecaseDeepSearchParameter'](filter, 'param');
      expect(output).toEqual({ 'param.age': { $gte: 18, $lte: 30 } });
    });

    it('should convert eq and neq to $eq and $ne', () => {
      const filter = { param: { status: { eq: 'active', neq: 'blocked' } } };
      const output = repo['convertUsecaseDeepSearchParameter'](filter, 'param');
      expect(output).toEqual({ 'param.status': { $eq: 'active', $ne: 'blocked' } });
    });

    it('should handle mixed operators', () => {
      const filter = { param: { createdAt: { min: new Date('2020-01-01') }, score: { eq: 100 } } };
      const output = repo['convertUsecaseDeepSearchParameter'](filter, 'param');
      expect(output).toEqual({ 'param.createdAt': { $gte: new Date('2020-01-01') }, 'param.score': { $eq: 100 } });
    });

    it('should skip fields with empty operator object', () => {
      const filter = { param: { name: {}, age: { max: 50 } } };
      const output = repo['convertUsecaseDeepSearchParameter'](filter, 'param');
      expect(output).toEqual({ 'param.age': { $lte: 50 } });
    });

    it('original filter remains untouched', () => {
      const filter = { param: { age: { max: 50 } } };
      repo['convertUsecaseDeepSearchParameter'](filter, 'param');
      expect(filter['param.age']).toBeFalsy();
      expect(filter.param.age).toBeTruthy();
    });

    it('returns empty filters for empty object or undefined input', () => {
      expect(repo['convertUsecaseDeepSearchParameter'](undefined as any, 'param')).toEqual(undefined);
      expect(repo['convertUsecaseDeepSearchParameter']({}, 'param')).toEqual({});
    });

    it('should handle nested fields with operators', () => {
      const filter = { param: { stats: { age: { min: 18, max: 30 } } } };
      const output = repo['convertUsecaseDeepSearchParameter'](filter, 'param');
      expect(output).toEqual({ 'param.stats.age': { $gte: 18, $lte: 30 } });
    });

    it('should handle deeply nested fields with multiple operators', () => {
      const filter = {
        param: {
          stats: {
            age: { min: 18, max: 30 },
            score: { eq: 100 },
            nested: { value: { neq: 5 } },
          },
        },
      };
      const output = repo['convertUsecaseDeepSearchParameter'](filter, 'param');
      expect(output).toEqual({
        'param.stats.age': { $gte: 18, $lte: 30 },
        'param.stats.score': { $eq: 100 },
        'param.stats.nested.value': { $ne: 5 },
      });
    });

    it('should skip empty nested operator objects', () => {
      const filter = { param: { stats: { name: {}, age: { max: 50 } } } };
      const output = repo['convertUsecaseDeepSearchParameter'](filter, 'param');
      expect(output).toEqual({ 'param.stats.age': { $lte: 50 } });
    });

    it('should handle multiple nested fields at the same level', () => {
      const filter = {
        param: {
          stats: {
            age: { min: 18 },
            score: { eq: 100 },
          },
          info: {
            level: { max: 10 },
          },
        },
      };
      const output = repo['convertUsecaseDeepSearchParameter'](filter, 'param');
      expect(output).toEqual({
        'param.stats.age': { $gte: 18 },
        'param.stats.score': { $eq: 100 },
        'param.info.level': { $lte: 10 },
      });
    });

    it('should not mutate the original filter object for nested fields', () => {
      const filter = { param: { stats: { age: { max: 50 } } } };
      repo['convertUsecaseDeepSearchParameter'](filter, 'param');
      expect(filter['param.stats.age']).toBeFalsy();
      expect(filter.param.stats.age).toBeTruthy();
    });
  });

  describe('getLimit()', () => {
    it('returns default limit when undefined', () => {
      expect(repo['getLimit'](undefined)).toBe(50);
    });

    it('returns default limit when null', () => {
      expect(repo['getLimit'](null)).toBe(50);
    });

    it('returns the provided limit if less than MAX_LIMIT', () => {
      expect(repo['getLimit'](10)).toBe(10);
    });

    it('returns MAX_LIMIT if provided limit is greater than MAX_LIMIT', () => {
      expect(repo['getLimit'](100)).toBe(50);
    });

    it('returns MAX_LIMIT if provided limit is exactly MAX_LIMIT', () => {
      expect(repo['getLimit'](50)).toBe(50);
    });

    it('returns default limit if provided limit is 0', () => {
      expect(repo['getLimit'](0)).toBe(50);
    });

    it('returns default limit if provided limit is NaN', () => {
      expect(repo['getLimit'](NaN)).toBe(50);
    });

    it('returns default limit if provided limit is negative', () => {
      expect(repo['getLimit'](-10)).toBe(50);
    });

    it('returns default limit if provided limit is not a number', () => {
      expect(repo['getLimit']('abc' as any)).toBe(50);
    });
  });

  describe('getOffset()', () => {
    it('returns default offset when undefined', () => {
      expect(repo['getOffset'](undefined)).toBe(0);
    });

    it('returns default offset when null', () => {
      expect(repo['getOffset'](null)).toBe(0);
    });

    it('returns the provided offset if positive number', () => {
      expect(repo['getOffset'](5)).toBe(5);
      expect(repo['getOffset'](123)).toBe(123);
    });

    it('returns default offset when 0', () => {
      expect(repo['getOffset'](0)).toBe(0);
    });

    it('returns default offset when negative number', () => {
      expect(repo['getOffset'](-10)).toBe(0);
      expect(repo['getOffset'](-1)).toBe(0);
    });

    it('returns default offset when NaN', () => {
      expect(repo['getOffset'](NaN)).toBe(0);
    });

    it('returns default offset when string', () => {
      expect(repo['getOffset']('abc' as any)).toBe(0);
      expect(repo['getOffset']('0' as any)).toBe(0);
      expect(repo['getOffset']('5' as any)).toBe(0);
    });

    it('returns default offset when boolean false', () => {
      expect(repo['getOffset'](false as any)).toBe(0);
    });

    it('returns default offset when boolean true', () => {
      expect(repo['getOffset'](true as any)).toBe(0);
    });

    it('returns default offset when object', () => {
      expect(repo['getOffset']({} as any)).toBe(0);
    });

    it('returns default offset when array', () => {
      expect(repo['getOffset']([] as any)).toBe(0);
      expect(repo['getOffset']([1, 2, 3] as any)).toBe(0);
    });
  });
  // TODO: add tests https://mygameapp.atlassian.net/browse/KWOKKA-395
});
