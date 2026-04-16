export class KwokkaAuthError extends Error {
  public constructor(
    public readonly message: string = 'Unexpected error occured. Our developers have already started fixing it!',
    public readonly code: string = 'UNEXPECTED_ERROR',
    public readonly data: any = null,
  ) {
    super(message);
  }
}
