export interface Usecase<T = any> {
  perform(...params: any[]): T;
}

interface UsecaseListResultMetadata {
  offset?: number;
  limit?: number;
  count: number;
}

export interface UsecaseListResult<T> {
  payload?: T[];
  metadata: UsecaseListResultMetadata;
}

export class UsecaseException extends Error {
  public constructor(
    public readonly code: string,
    message: string,
  ) {
    super(message);
  }
}
