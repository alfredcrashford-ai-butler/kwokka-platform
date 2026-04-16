import Joi from 'joi';
import { ViewModel } from '../../router';
import { ValidationResult, ValidationUtil } from '../../../util';

export interface ValidationRequest {
  body?: object;
  params?: object;
  query?: object;
}

export class ValidationConfig {
  public constructor(public readonly viewModel: ViewModel) {}

  public get schema(): Joi.Schema {
    const schema: any = {};

    if (this.viewModel?.params) {
      schema.params = this.viewModel?.params;
    }

    if (this.viewModel?.body) {
      schema.body = this.viewModel?.body;
    }

    if (this.viewModel?.query) {
      schema.query = this.viewModel?.query;
    }

    return Joi.object(schema);
  }

  public get isValid(): boolean {
    return ValidationUtil.isValid(this.schema);
  }

  public validate(request: { body?: object; params?: object; query?: object }): ValidationResult {
    const sanitizedRequest = this.sanitizeRequest(request);
    return ValidationUtil.validate(sanitizedRequest, this.schema);
  }

  private sanitizeObject(maybeEmptyObject?: object): object {
    if (typeof maybeEmptyObject !== 'object') {
      return maybeEmptyObject;
    }

    return Object.keys(maybeEmptyObject).length === 0 ? undefined : maybeEmptyObject;
  }

  private sanitizeRequest(req: ValidationRequest): ValidationRequest {
    const sanitizedRequest: any = {};

    const body = this.sanitizeObject(req.body);
    if (body) {
      sanitizedRequest.body = body;
    }

    const params = this.sanitizeObject(req.params);
    if (params) {
      sanitizedRequest.params = params;
    }

    const query = this.sanitizeObject(req.query);
    if (query) {
      sanitizedRequest.query = query;
    }

    return sanitizedRequest;
  }
}
