import { TokenContent } from '@kwokka/entities';
import { KwokkaSdkNodeConfig } from '../config';
import { ErrorWrapper, UnauthorizedError } from '../error';
import { HttpUtil } from '../util';

type TokenPair = { access: string; refresh: string };

export class AuthAPI {
  private readonly baseUrl: string;
  private _accessToken: string;
  private _refreshToken: string;

  public constructor(private readonly config: KwokkaSdkNodeConfig) {
    this.baseUrl = `${this.config.endpoint}/owl`;
  }

  public get authHeaders(): Record<string, string> {
    return { Authorization: `Bearer ${this.accessToken}` };
  }

  public get accessToken(): string {
    return this._accessToken;
  }

  public get accountId(): string {
    const accessTokenBody = (this._accessToken || '..').split('.')[1]
    const accessTokenContentString = atob(accessTokenBody) || '{}';
    const accessTokenContent = JSON.parse(accessTokenContentString) as TokenContent;
    return accessTokenContent?.accountId;
  }

  public async authorize(): Promise<TokenPair> {
    const tokenPair = await this.getTokenPair();

    this._accessToken = tokenPair.access;
    this._refreshToken = tokenPair.refresh;

    return tokenPair;
  }

  public async withAuth<T>(fn: () => Promise<T>): Promise<T> {
    try {
      if (!this._accessToken) {
        await this.authorize();
      }
      return await fn();
    } catch (e: any) {
      if (e instanceof UnauthorizedError) {
        await this.authorize();
        return await fn();
      }

      this.config.logger.error('Unexpected error occurred in withAuth()', e);
      throw ErrorWrapper.wrap(e);
    }
  }

  private async getTokenPair(): Promise<TokenPair> {
    try {
      if (this._refreshToken) {
        try {
          return await this.refreshAccess();
        } catch (e: any) {
          if (e instanceof UnauthorizedError) {
            return await this.signIn();
          }
        }
      } else {
        return await this.signIn();
      }
    } catch (e) {
      throw ErrorWrapper.wrap(e);
    }
  }

  private async signIn(): Promise<TokenPair> {
    const url = `${this.baseUrl}/v1/onboarding/sign-in/secret`;
    const authData = { clientId: this.config.clientId, secret: this.config.secret };
    const responseBody = await HttpUtil.post<{ data: TokenPair }>(url, authData);
    return responseBody.data;
  }

  private async refreshAccess(): Promise<TokenPair> {
    const url = `${this.baseUrl}/v1/tokens/refresh?refreshToken=${this._refreshToken}`;
    const responseBody = await HttpUtil.post<{ data: TokenPair }>(url, null, { ...this.authHeaders });
    const tokenPair = responseBody.data;

    this._accessToken = tokenPair.access;
    this._refreshToken = tokenPair.refresh;

    return tokenPair;
  }
}
