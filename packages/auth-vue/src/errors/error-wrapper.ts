import { KwokkaAuthError } from './kwokka-auth-error';

export class ErrorWrapper {
  public static wrap(error: any) {
    return error instanceof KwokkaAuthError ? error : new KwokkaAuthError(error?.message, error?.code, error);
  }
}
