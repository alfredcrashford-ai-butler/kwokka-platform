import { inject, injectable } from 'inversify';
import { ResponseInterceptor, type InterceptorParams } from './interceptor';
import { PersistenceService } from '../persistence/persistence.service';
import { PersistenceKey } from '../persistence/persistence-key';
import { TokenApi } from '@/api/auth/token/token.api';
import { ConfigService } from '../config/config.service';
import { HttpService } from './http.service';

@injectable()
export class AuthResponseInterceptor extends ResponseInterceptor {
  public constructor(
    @inject(PersistenceService) private persistenceService: PersistenceService,
    @inject(TokenApi) private tokenApi: TokenApi,
    @inject(ConfigService) private configService: ConfigService,
    @inject(HttpService) private http: HttpService,
  ) {
    super();
  }

  public async perform(params: InterceptorParams, res: Response): Promise<Response> {
    if (res.status === 401) {
      // only run refresh access api call if the request is not for refresh access
      if (!params.url.includes(this.tokenApi.refreshAccessUrl)) {
        try {
          const refreshToken = this.persistenceService.loadValue(PersistenceKey.RefreshToken);
          const response = await this.tokenApi.refreshAccess(refreshToken);
          this.persistenceService.storeValue(PersistenceKey.AccessToken, response.access);
          this.persistenceService.storeValue(PersistenceKey.RefreshToken, response.refresh);
          // retry the request
          return await this.http.fetch(params.path, { method: params.method, headers: params.headers }, params.body);
        } catch (e) {
          return this.cleanupAndRedirectToRoot(res);
        }
      }

      return this.cleanupAndRedirectToRoot(res);
    }
    return res;
  }

  private cleanupAndRedirectToRoot(res: Response): Response {
    this.persistenceService.clearValue(PersistenceKey.AccessToken);
    this.persistenceService.clearValue(PersistenceKey.RefreshToken);
    window.open(this.configService.frontendConfig.rootUrl, '_self');
    return res;
  }
}
