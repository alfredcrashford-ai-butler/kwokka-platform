import Joi, { Schema } from 'joi';

export interface ValidationResult<T = any> {
  errors: string[];
  value: T;
}

export class ValidationUtil {
  public static isValid(schema: Schema): boolean {
    return Joi.isSchema(schema);
  }

  public static validate(obj: any, schema: Schema): ValidationResult {
    const result = schema.validate(obj);
    const errors = result?.error?.details || [];
    const errorMessages = errors.map(el => el.message);
    return { value: result?.value, errors: errorMessages.length ? errorMessages : undefined };
  }
}
