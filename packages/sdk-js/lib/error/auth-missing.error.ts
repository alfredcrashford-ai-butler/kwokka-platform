import { ErrorCode } from './error-code';
import { KwokkaSdkJsError } from './kwokka-sdk-js.error';

export class AuthMissingError extends KwokkaSdkJsError {
  public constructor(data?: any) {
    super('Auth tokens are missing or can not be used', ErrorCode.AuthMissing, data);
  }
}
