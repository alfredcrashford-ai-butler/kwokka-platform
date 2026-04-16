import { inject, injectable } from 'inversify';
import { RequestInterceptor, type InterceptorParams } from './interceptor';
import { AccessService } from '../access/access.service';

@injectable()
export class AuthRequestInterceptor extends RequestInterceptor {
  public constructor(@inject(AccessService) private accessService: AccessService) {
    super();
  }

  public async perform(params: InterceptorParams): Promise<InterceptorParams> {
    const accessToken = this.accessService.getAccessToken();
    if (accessToken) {
      params = Object.assign({}, params);
      params.headers = { ...(params.headers || {}), Authorization: `Bearer ${accessToken}` };
    }
    return params;
  }
}
