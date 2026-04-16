import { KwokkaSdkNodeError } from './kwokka-sdk-node.error';

export class ErrorWrapper {
  public static wrap(error: any) {
    return error instanceof KwokkaSdkNodeError ? error : new KwokkaSdkNodeError(error?.message, error?.code, error);
  }
}
