import { KwokkaSdkJsError } from './kwokka-sdk-js.error';

export class ErrorWrapper {
  public static wrap(error: any) {
    return error instanceof KwokkaSdkJsError ? error : new KwokkaSdkJsError(error?.message, error?.code, error);
  }
}
