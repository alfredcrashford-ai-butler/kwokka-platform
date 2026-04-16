import { injectable } from 'inversify';
import { RequestInterceptor, type InterceptorParams } from './interceptor';

@injectable()
export class ContentTypeRequestInterceptor extends RequestInterceptor {
  public async perform(params: InterceptorParams): Promise<InterceptorParams> {
    params = Object.assign({}, params);
    params.headers = { ...(params.headers || {}), 'Content-Type': 'application/json;charset=UTF-8' };
    return params;
  }
}
