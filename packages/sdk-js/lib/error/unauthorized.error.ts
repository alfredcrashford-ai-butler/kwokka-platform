import { ErrorCode } from './error-code';
import { KwokkaSdkJsError } from './kwokka-sdk-js.error';

export class UnauthorizedError extends KwokkaSdkJsError {
  public constructor(data?: any) {
    super('Unauthorized', ErrorCode.Unauthorized, data);
  }
}
