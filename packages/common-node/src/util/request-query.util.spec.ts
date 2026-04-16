import { RequestQueryUtil } from './request-query.util';

describe(RequestQueryUtil, () => {
  it('exists', () => {
    expect(RequestQueryUtil).toBeTruthy();
  });

  describe('parseOffset()', () => {
    it('exists', () => {
      expect(RequestQueryUtil.parseOffset).toBeTruthy();
    });

    it('returns value of offset param', () => {
      const request: any = { query: { offset: 10 } };
      const result = RequestQueryUtil.parseOffset(request);
      expect(result).toEqual(10);
    });

    it('returns 0 if offset is not provided', () => {
      const request: any = { query: {} };
      const result = RequestQueryUtil.parseOffset(request);
      expect(result).toEqual(0);
    });
  });

  describe('parseLimit()', () => {
    it('exists', () => {
      expect(RequestQueryUtil.parseLimit).toBeTruthy();
    });

    it('returns value of limit param', () => {
      const request: any = { query: { limit: 100 } };
      const result = RequestQueryUtil.parseLimit(request);
      expect(result).toEqual(100);
    });

    it('returns 0 if limit is not provided', () => {
      const request: any = { query: {} };
      const result = RequestQueryUtil.parseLimit(request);
      expect(result).toEqual(50);
    });
  });

  describe('parseStringQueryParam()', () => {
    it('exists', () => {
      expect(RequestQueryUtil.parseStringQueryParam).toBeTruthy();
    });

    it('returns given string if it is provided as a query parameter', () => {
      const request: any = { query: { param_name_1: 'str_value' } };
      const result = RequestQueryUtil.parseStringQueryParam(request, 'param_name_1');
      expect(result).toEqual('str_value');
    });

    it('returns given number as string if it is provided as a query parameter', () => {
      const request: any = { query: { param_name_1: 244 } };
      const result = RequestQueryUtil.parseStringQueryParam(request, 'param_name_1');
      expect(result).toEqual('244');
    });

    it('returns first element of array as a string if array is provided as a query parameter', () => {
      const request: any = { query: { param_name_1: ['1', '2'] } };
      const result = RequestQueryUtil.parseStringQueryParam(request, 'param_name_1');
      expect(result).toEqual('1');
    });

    it('returns undefined if param is undefined', () => {
      const request: any = { query: { param_name_1: undefined } };
      const result = RequestQueryUtil.parseStringQueryParam(request, 'param_name_1');
      expect(result).toEqual(undefined);
    });

    it('returns default value if param is undefined', () => {
      const request: any = { query: { param_name_1: undefined } };
      const result = RequestQueryUtil.parseStringQueryParam(request, 'param_name_1', 'default');
      expect(result).toEqual('default');
    });

    it('returns default value if param is null', () => {
      const request: any = { query: { param_name_1: null } };
      const result = RequestQueryUtil.parseStringQueryParam(request, 'param_name_1', 'default');
      expect(result).toEqual('default');
    });

    it('returns the value if it is falsy value', () => {
      const request: any = { query: { param_name_1: 0 } };
      const result = RequestQueryUtil.parseStringQueryParam(request, 'param_name_1', 'default');
      expect(result).toEqual('0');
    });
  });

  describe('parseStringArrayQueryParam()', () => {
    it('exists', () => {
      expect(RequestQueryUtil.parseStringArrayQueryParam).toBeTruthy();
    });

    it('returns the param if it is a string array', () => {
      const request: any = { query: { param_name_1: ['250', '350'] } };
      const result = RequestQueryUtil.parseStringArrayQueryParam(request, 'param_name_1');
      expect(result).toEqual(['250', '350']);
    });

    it('transforms query params to strings except null or undefined array when one of the elements is not string', () => {
      const request: any = { query: { param_name_1: ['250', 350, null, undefined] } };
      const result = RequestQueryUtil.parseStringArrayQueryParam(request, 'param_name_1');
      expect(result).toEqual(['250', '350', null, undefined]);
    });

    it('returns default value if query param is null', () => {
      const request: any = { query: { param_name_1: undefined } };
      const result = RequestQueryUtil.parseStringArrayQueryParam(request, 'param_name_1', ['default']);
      expect(result).toEqual(['default']);
    });

    it('returns default value if query param is undefined', () => {
      const request: any = { query: { param_name_1: null } };
      const result = RequestQueryUtil.parseStringArrayQueryParam(request, 'param_name_1', ['default']);
      expect(result).toEqual(['default']);
    });

    it('returns default value if query param is an array of single undefined', () => {
      const request: any = { query: { param_name_1: [undefined] } };
      const result = RequestQueryUtil.parseStringArrayQueryParam(request, 'param_name_1', ['default']);
      expect(result).toEqual(['default']);
    });

    it('returns default value if query param is an array of single null', () => {
      const request: any = { query: { param_name_1: [null] } };
      const result = RequestQueryUtil.parseStringArrayQueryParam(request, 'param_name_1', ['default']);
      expect(result).toEqual(['default']);
    });

    it('transforms query param to string array when it is a string', () => {
      const request: any = { query: { param_name_1: 'something' } };
      const result = RequestQueryUtil.parseStringArrayQueryParam(request, 'param_name_1');
      expect(result).toEqual(['something']);
    });

    it('transforms query param to string array when it is a string with commas', () => {
      const request: any = { query: { param_name_1: '1,2,3' } };
      const result = RequestQueryUtil.parseStringArrayQueryParam(request, 'param_name_1');
      expect(result).toEqual(['1', '2', '3']);
    });

    it('returns default value if query param is an empty array', () => {
      const request: any = { query: { param_name_1: [] } };
      const result = RequestQueryUtil.parseStringArrayQueryParam(request, 'param_name_1', ['default']);
      expect(result).toEqual(['default']);
    });
  });

  describe('parseIntQueryParam()', () => {
    it('exists', () => {
      expect(RequestQueryUtil.parseIntQueryParam).toBeTruthy();
    });

    it('returns the value if it is falsy value', () => {
      const request: any = { query: { param_name_1: '250' } };
      const result = RequestQueryUtil.parseIntQueryParam(request, 'param_name_1');
      expect(result).toEqual(250);
    });

    it('returns the default value if provided param is undefined', () => {
      const request: any = { query: { param_name_1: undefined } };
      const result = RequestQueryUtil.parseIntQueryParam(request, 'param_name_1', 10);
      expect(result).toEqual(10);
    });

    it('returns the default value if provided param is null', () => {
      const request: any = { query: { param_name_1: null } };
      const result = RequestQueryUtil.parseIntQueryParam(request, 'param_name_1', 10);
      expect(result).toEqual(10);
    });

    it('returns the value if it is falsy value', () => {
      const request: any = { query: { param_name_1: 0 } };
      const result = RequestQueryUtil.parseIntQueryParam(request, 'param_name_1', 10);
      expect(result).toEqual(0);
    });

    it('returns default value if value is parsed into NaN', () => {
      const request: any = { query: { param_name_1: 'something crazy' } };
      const result = RequestQueryUtil.parseIntQueryParam(request, 'param_name_1', 10);
      expect(result).toEqual(10);
    });

    it('returns default value parsing throws error', () => {
      jest.spyOn(Number, 'parseInt').mockImplementation(() => {throw 'error';});
      const request: any = { query: { param_name_1: 255 } };
      const result = RequestQueryUtil.parseIntQueryParam(request, 'param_name_1', 10);
      expect(result).toEqual(10);
    });
  });
});
