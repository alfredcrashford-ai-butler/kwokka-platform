import { KwokkaAvatarError } from './kwokka-avatar-error';

export class ErrorWrapper {
  public static wrap(error: any) {
    return error instanceof KwokkaAvatarError ? error : new KwokkaAvatarError(error?.message, error?.code, error);
  }
}
