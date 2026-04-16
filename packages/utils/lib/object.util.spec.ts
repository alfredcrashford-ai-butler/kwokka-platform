import { ObjectUtil } from './object.util';

describe(ObjectUtil, () => {
  it('exists', () => {
    expect(ObjectUtil).toBeTruthy();
  });

  describe('clone()', () => {
    it('exists', () => {
      expect(ObjectUtil.clone).toBeInstanceOf(Function);
    });

    it('clones values of object', () => {
      const object = { a: 'A', b: 'B', n: 255000, sub: { subSub: 'val' } };

      expect(ObjectUtil.clone(object)).toEqual(object);
    });

    it('clones object with new ref', () => {
      const object = {};

      expect(ObjectUtil.clone(object)).not.toBe(object);
    });

    it('clones empty values', () => {
      expect(ObjectUtil.clone(null as never)).toEqual(null);
      expect(ObjectUtil.clone(undefined as never)).toEqual(undefined);
    });
  });

  describe('mapDeep()', () => {
    it('exists', () => {
      expect(ObjectUtil.mapDeep).toBeInstanceOf(Function);
    });

    it('works correctly with nullish values', () => {
      expect(ObjectUtil.mapDeep(undefined, (v: any) => `pre_${v}`)).toEqual('pre_undefined');
      expect(ObjectUtil.mapDeep(null, (v: any) => `pre_${v}`)).toEqual('pre_null');
      expect(ObjectUtil.mapDeep(void 0, (v: any) => `pre_${v}`)).toEqual('pre_undefined');
    });

    it('works correctly with numbers', () => {
      expect(ObjectUtil.mapDeep(0, (v: any) => `pre_${v}`)).toEqual('pre_0');
      expect(ObjectUtil.mapDeep(100, (v: any) => `pre_${v}`)).toEqual('pre_100');
      expect(ObjectUtil.mapDeep(-100, (v: any) => `pre_${v}`)).toEqual('pre_-100');
      expect(ObjectUtil.mapDeep(Infinity, (v: any) => `pre_${v}`)).toEqual('pre_Infinity');
      expect(ObjectUtil.mapDeep(-Infinity, (v: any) => `pre_${v}`)).toEqual('pre_-Infinity');
      expect(ObjectUtil.mapDeep(NaN, (v: any) => `pre_${v}`)).toEqual('pre_NaN');
    });

    it('works correctly with arrays', () => {
      expect(ObjectUtil.mapDeep(['a', 'b', 'c'], (v: any) => `pre_${v}`)).toEqual(['pre_a', 'pre_b', 'pre_c']);
    });

    it('works correctly with objects', () => {
      expect(ObjectUtil.mapDeep({ a: 'a', b: 'b' }, (v: any) => `pre_${v}`)).toEqual({ a: 'pre_a', b: 'pre_b' });
    });

    it('works correctly for nested objects', () => {
      const obj = { a: 'a', b: { c: { d: [{ e: 'e', f: [{ g: 'g' }, 'h', 'i'] }, 'j'] } } };
      const expected = {
        a: 'pre_a',
        b: { c: { d: [{ e: 'pre_e', f: [{ g: 'pre_g' }, 'pre_h', 'pre_i'] }, 'pre_j'] } },
      };

      const result = ObjectUtil.mapDeep(obj, (v: any) => `pre_${v}`);

      expect(result).toEqual(expected);
    });
  });

  describe('take()', () => {
    it('exists', () => {
      expect(ObjectUtil.take).toBeInstanceOf(Function);
    });

    it('returns same object if given non-object or nullish value', () => {
      expect(ObjectUtil.take(null, ['name', 'age', 'toString'])).toEqual(null);
      expect(ObjectUtil.take(undefined, ['name', 'age', 'toString'])).toEqual(undefined);
      expect(ObjectUtil.take(NaN, ['value', 'toString'])).toEqual(NaN);
      expect(ObjectUtil.take(20, ['value', 'toString'])).toEqual(20);
      expect(ObjectUtil.take('twenty', ['value', 'toString'])).toEqual('twenty');
    });

    it('takes only values that are explicitly defined', () => {
      expect(ObjectUtil.take({ name: 'John', title: 'Dr' }, ['name', 'age'])).toEqual({ name: 'John' });
    });

    it('takes only values that are explicitly defined', () => {
      expect(ObjectUtil.take({ name: 'John', title: 'Dr' }, ['name', 'age'])).toEqual({ name: 'John' });
    });
  });
});
