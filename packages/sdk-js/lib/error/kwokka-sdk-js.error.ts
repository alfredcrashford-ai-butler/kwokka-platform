import { ErrorCode } from './error-code';

export class KwokkaSdkJsError extends Error {
  public constructor(
    public readonly message: string = 'Unexpected error occured.',
    public readonly code: string = ErrorCode.UnexpectedError,
    public readonly data: any = null,
  ) {
    super(message);
  }
}
