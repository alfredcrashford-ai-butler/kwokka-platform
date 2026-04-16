import { injectable } from 'inversify';

export type InterceptorParams = { url: string; path: string; method: string; body?: any; headers?: HeadersInit };

@injectable()
export abstract class RequestInterceptor {
  public abstract perform(params: InterceptorParams): Promise<InterceptorParams>;
}

@injectable()
export abstract class ResponseInterceptor {
  public abstract perform(params: InterceptorParams, res: Response): Promise<Response>;
}
