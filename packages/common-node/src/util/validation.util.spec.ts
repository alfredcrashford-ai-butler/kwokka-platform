import Joi from 'joi';
import { ValidationUtil } from './validation.util';

describe(ValidationUtil, () => {
  it('exists', () => {
    expect(ValidationUtil).toBeTruthy();
  });

  describe('isValid()', () => {
    it('exists', () => {
      expect(ValidationUtil.isValid).toBeTruthy();
    });

    it('returns true for Joi schema', () => {
      expect(ValidationUtil.isValid(Joi.object({}))).toEqual(true);
    });

    it('returns false for undefined', () => {
      expect(ValidationUtil.isValid(undefined as any)).toEqual(false);
    });
  });

  describe('validate()', () => {
    it('exists', () => {
      expect(ValidationUtil.validate).toBeTruthy();
    });

    it('returns no errors for valid object', () => {
      const result = ValidationUtil.validate({ a: 'string' }, Joi.object({ a: Joi.string() }));
      expect(result.errors).toBeFalsy();
    });

    it('returns errors for invalid object', () => {
      const result = ValidationUtil.validate({ a: 34 }, Joi.object({ a: Joi.string() }));
      expect(result.errors.length).toEqual(1);
    });
  });
});
