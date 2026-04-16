import { ErrorCode } from './error-code';
import { KwokkaSdkNodeError } from './kwokka-sdk-node.error';

export class UnauthorizedError extends KwokkaSdkNodeError {
  public constructor(data?: any) {
    super('Unauthorized', ErrorCode.Unauthorized, data);
  }
}
