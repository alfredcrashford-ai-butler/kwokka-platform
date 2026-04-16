import { ErrorCode } from './error-code';

export class KwokkaAvatarError extends Error {
  public constructor(
    public readonly message: string = 'Unexpected error occured. Our developers have already started fixing it!',
    public readonly code: string = ErrorCode.UnexpectedError,
    public readonly data: any = null,
  ) {
    super(message);
  }
}
