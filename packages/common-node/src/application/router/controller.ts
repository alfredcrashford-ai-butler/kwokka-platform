import { Request } from 'express';
import { inject, injectable } from 'inversify';
import { LoggerService } from '../service';
import { HttpStatus } from './http-status';
import { ErrorCode, RequestQueryUtil } from '../../util';

@injectable()
export class Controller {
  protected readonly logPrefix = `${this.constructor.name}:`;

  @inject(LoggerService)
  protected logger: LoggerService;

  protected parseOffset(req: Request): number {
    return RequestQueryUtil.parseOffset(req);
  }

  protected parseLimit(req: Request): number {
    return RequestQueryUtil.parseLimit(req);
  }

  protected parseSort(req: Request): Record<string, 'asc' | 'desc'> {
    const sort = {};
    const sortKeys = this.parseStringArrayQueryParam(req, 'sort', []);
    const orders = this.parseStringArrayQueryParam(req, 'order', []);
    sortKeys.forEach((key, i) => (sort[key] = orders[i]));
    return sort;
  }

  protected parseStringQueryParam(req: Request, paramName: string, defaultValue: string = undefined): string {
    return RequestQueryUtil.parseStringQueryParam(req, paramName, defaultValue);
  }

  protected parseStringArrayQueryParam(req: Request, paramName: string, defaultValue: string[] = undefined): string[] {
    return RequestQueryUtil.parseStringArrayQueryParam(req, paramName, defaultValue);
  }

  protected parseIntQueryParam(req: Request, paramName: string, defaultValue: number = undefined): number {
    return RequestQueryUtil.parseIntQueryParam(req, paramName, defaultValue);
  }

  protected parseObjectQueryParam(req: Request, paramName: string, defaultValue = undefined): Record<string, any> {
    const string = this.parseStringQueryParam(req, paramName);
    if (!string) {
      return defaultValue;
    }

    try {
      return JSON.parse(string);
    } catch (error) {
      this.logger.warn(`JSON.parse() failed when casting "${paramName}" to object. Error: `, error);
      return defaultValue;
    }
  }
}

export class ControllerException extends Error {
  public constructor(
    public readonly code: string,
    message: string,
    public readonly status: HttpStatus = HttpStatus.BadRequest,
  ) {
    super(message);
  }
}

export class EntityNotFoundControllerException extends ControllerException {
  public constructor(context: string) {
    super(ErrorCode.EntityNotFound, `Entity not found: ${context}`, HttpStatus.BadRequest);
  }
}

export class MethodNotImplementedControllerException extends ControllerException {
  public constructor(context: string) {
    super(ErrorCode.MethodNotImplemented, `Method not implemented: ${context}`, HttpStatus.NotImplemented);
  }
}
