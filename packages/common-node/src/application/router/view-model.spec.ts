import Joi from 'joi';
import { DeepSearchViewModel, QueryListViewModel, SortQueryListViewModel } from './view-model';

describe('QueryListViewModel', () => {
  it('exists', () => {
    expect(QueryListViewModel).toBeTruthy();
  });

  // TODO: add tests https://mygameapp.atlassian.net/browse/KWOKKA-395
});

describe('SortQueryListViewModel', () => {
  const schema = Joi.object({ ...SortQueryListViewModel });

  it('exists', () => {
    expect(SortQueryListViewModel).toBeTruthy();
  });

  it('returns no errors for empty object', () => {
    const result = schema.validate({});
    expect(result.error).toEqual(undefined);
  });

  it('returns an error when sort is provided and order is not', () => {
    const result = schema.validate({ sort: ['createdAt', 'players'] });
    expect(result.error?.message).toEqual(
      '"sort" failed custom validation because "order" and "sort" must be both provided',
    );
  });

  it('returns an error when order is provided and sort is not', () => {
    const result = schema.validate({ order: ['asc', 'desc'] });
    expect(result.error?.message).toEqual(
      '"order" failed custom validation because "order" and "sort" must be both provided',
    );
  });

  it('returns an error when order has incorrect values', () => {
    const result = schema.validate({ order: ['1', '-1'], sort: ['createdAt', 'players'] });
    expect(result.error?.message).toEqual(
      '"sort" failed custom validation because "order" must be an array of "asc" and "desc" strings',
    );
  });

  it('returns an error when order and sort have different sizes', () => {
    const result = schema.validate({ order: ['asc'], sort: ['createdAt', 'players'] });
    expect(result.error?.message).toEqual(
      '"sort" failed custom validation because "order" and "sort" must have the same size',
    );
  });

  it('returns no errors if order and sort are same size array and order consists of "asc" and "desc"', () => {
    const result = schema.validate({ order: ['asc', 'desc'], sort: ['createdAt', 'players'] });
    expect(result.error?.message).toEqual(undefined);
  });

  it('works when sort and order are array strings', () => {
    const result = schema.validate({ order: 'asc,desc', sort: 'createdAt,players' });
    expect(result.error?.message).toEqual(undefined);
  });
});

describe('DeepSearchViewModel', () => {
  const schema = DeepSearchViewModel;

  it('validates range as numbers, strings, or dates', () => {
    expect(schema.validate({ age: { min: 18, max: 30 } }).error).toBeUndefined();
    expect(schema.validate({ name: { min: 'aaa', max: 'zzzz' } }).error).toBeUndefined();
    expect(schema.validate({ birthday: { min: new Date(0), max: new Date() } }).error).toBeUndefined();
  });

  it('fails when range is given as null', () => {
    expect(schema.validate({ age: { min: null } }).error).toBeTruthy();
    expect(schema.validate({ age: { max: null } }).error).toBeTruthy();
  });

  it('fails when range is given as boolean', () => {
    expect(schema.validate({ age: { min: true } }).error).toBeTruthy();
    expect(schema.validate({ age: { max: false } }).error).toBeTruthy();
  });

  it('validates eq as number, string, date, or null', () => {
    expect(schema.validate({ age: { eq: 18 } }).error).toBeUndefined();
    expect(schema.validate({ name: { eq: 'mike' } }).error).toBeUndefined();
    expect(schema.validate({ birthday: { eq: new Date() } }).error).toBeUndefined();
    expect(schema.validate({ tatoos: { eq: null } }).error).toBeUndefined();
  });

  it('validates neq as number, string, date, or null', () => {
    expect(schema.validate({ age: { neq: 18 } }).error).toBeUndefined();
    expect(schema.validate({ name: { neq: 'mike' } }).error).toBeUndefined();
    expect(schema.validate({ birthday: { neq: new Date() } }).error).toBeUndefined();
    expect(schema.validate({ tatoos: { neq: null } }).error).toBeUndefined();
  });

  it('fails when eq is given as boolean', () => {
    expect(schema.validate({ age: { eq: false } }).error).toBeTruthy();
  });

  it('fails when eq is given as boolean', () => {
    expect(schema.validate({ age: { neq: false } }).error).toBeTruthy();
  });

  it('validates complex objects', () => {
    expect(schema.validate({ age: { min: 18, max: 35, neq: 27, eq: 51 } }).error).toBeUndefined();
    expect(schema.validate({ name: { min: 'aaaa', max: 'ZZZZ', neq: 'Mike', eq: null } }).error).toBeUndefined();
  });

  it('validates empty operators', () => {
    expect(schema.validate({ age: {} }).error).toBeUndefined();
  });

  it('works properly for stringified objects', () => {
    const input = JSON.stringify({ age: { min: 18, max: 35, neq: 27 } });
    expect(schema.validate(input).error).toBeUndefined();
  });

  it('fails on incorrect json string', () => {
    const input = '{"name": "John", ';
    expect(schema.validate(input).error).toBeTruthy();
  });

  it('fails on json string containing array', () => {
    const input = '["1","2"]';
    expect(schema.validate(input).error).toBeTruthy();
  });

  it('fails on json string containing a primitive', () => {
    expect(schema.validate('null').error).toBeTruthy();
    expect(schema.validate('"hey there"').error).toBeTruthy();
    expect(schema.validate('69').error).toBeTruthy();
    expect(schema.validate('true').error).toBeTruthy();
    expect(schema.validate('false').error).toBeTruthy();
    expect(schema.validate('undefined').error).toBeTruthy();
  });

  it('validates nested objects', () => {
    const input = {
      user: {
        age: { min: 18, max: 30 },
        profile: {
          name: { eq: 'Alice' },
          birthday: { min: new Date('1990-01-01'), max: new Date('2000-12-31') }
        }
      }
    };
    expect(schema.validate(input).error).toBeUndefined();
  });
});
