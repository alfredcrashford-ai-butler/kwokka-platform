import Joi from 'joi';
import { ValidationConfig } from './validation-config';

describe('ValidationConfig', () => {
  it('exists', () => {
    expect(ValidationConfig).toBeTruthy();
  });

  it('can be created', () => {
    expect(new ValidationConfig({})).toBeTruthy();
  });

  describe('get schema()', () => {
    it('returns joi schema for empty view model', () => {
      const config = new ValidationConfig({});
      expect(config.schema).toBeTruthy();
    });

    it('returns joi schema for view model with body', () => {
      const config = new ValidationConfig({ body: Joi.object({ a: Joi.string() }) });
      expect(config.schema).toBeTruthy();
    });

    it('returns joi schema for view model with params', () => {
      const config = new ValidationConfig({ params: Joi.object({ a: Joi.string() }) });
      expect(config.schema).toBeTruthy();
    });

    it('returns joi schema for view model with query', () => {
      const config = new ValidationConfig({ query: Joi.object({ a: Joi.string() }) });
      expect(config.schema).toBeTruthy();
    });

    it('returns joi schema for view model with all parts', () => {
      const config = new ValidationConfig({
        body: Joi.object({ a: Joi.string() }),
        params: Joi.object({ a: Joi.string() }),
        query: Joi.object({ a: Joi.string() }),
      });
      expect(config.schema).toBeTruthy();
    });
  });

  describe('get isValid()', () => {
    it('returns true for empty config', () => {
      const config = new ValidationConfig({});
      expect(config.isValid).toBeTruthy();
    });

    it('returns true for view model with body', () => {
      const config = new ValidationConfig({ body: Joi.object({ a: Joi.string() }) });
      expect(config.isValid).toBeTruthy();
    });

    it('returns true for view model with params', () => {
      const config = new ValidationConfig({ params: Joi.object({ a: Joi.string() }) });
      expect(config.isValid).toBeTruthy();
    });

    it('returns true for view model with query', () => {
      const config = new ValidationConfig({ query: Joi.object({ a: Joi.string() }) });
      expect(config.isValid).toBeTruthy();
    });

    it('returns true for view model with query', () => {
      const config = new ValidationConfig({
        body: Joi.object({ a: Joi.string() }),
        params: Joi.object({ a: Joi.string() }),
        query: Joi.object({ a: Joi.string() }),
      });
      expect(config.isValid).toBeTruthy();
    });
  });

  describe('validate()', () => {
    it('exists', () => {
      const config = new ValidationConfig({});
      expect(config.validate).toBeTruthy();
    });

    it('returns no errors if validates correctly', () => {
      const config = new ValidationConfig({
        body: Joi.object({ a: Joi.string().required() }),
        params: Joi.object({ b: Joi.string().required() }),
        query: Joi.object({ c: Joi.string().required() }),
      });

      expect(config.validate({ body: { a: '4' }, params: { b: '4' }, query: { c: '4' } })).toEqual({
        value: { body: { a: '4' }, params: { b: '4' }, query: { c: '4' } },
      });
    });

    it('returns one error if validation failes in one field', () => {
      const config = new ValidationConfig({
        body: Joi.object({
          a: Joi.string().required(),
          b: Joi.string().required(),
        }),
      });
      const expected = { errors: ['"body.b" is required'], value: { body: { a: 'a' } } };

      expect(config.validate({ body: { a: 'a' } })).toEqual(expected);
    });

    it('returns no errors when validating empty body with empty config', () => {
      const config = new ValidationConfig({});
      const expected = { value: { body: undefined } };

      expect(config.validate({ body: undefined })).toEqual(expected);
    });

    it('returns no errors when validating empty params with empty config', () => {
      const config = new ValidationConfig({});
      const expected = { value: { params: undefined } };

      expect(config.validate({ params: undefined })).toEqual(expected);
    });

    it('returns no errors when validating empty query with empty config', () => {
      const config = new ValidationConfig({});
      const expected = { value: { query: undefined } };

      expect(config.validate({ query: undefined })).toEqual(expected);
    });
  });
});
