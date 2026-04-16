import { CredentialEntity, TokenContent } from '@kwokka/entities';
import type { KwokkaSdkJsConfig } from '../config';
import { ErrorWrapper, UnauthorizedError } from '../error';
import { ACCESS_TOKEN_PERSISTENCE_KEY, Dto, HttpUtil, PersistenceUtil, REFRESH_TOKEN_PERSISTENCE_KEY } from '../util';
import { TokenPair } from '../util/interface';

export class AuthInternalAPI {
  private readonly baseUrl: string;
  private _accessToken: string;
  private _refreshToken: string;

  public constructor(private readonly config: KwokkaSdkJsConfig) {
    this.baseUrl = `${this.config.endpoint}/owl`;
  }

  public get authHeaders(): Record<string, string> {
    return { Authorization: `Bearer ${this.accessToken}` };
  }

  public get accessToken(): string {
    return this._accessToken;
  }

  public get accountId(): string {
    const accessTokenBody = (this._accessToken || '..').split('.')[1];
    const accessTokenContentString = atob(accessTokenBody) || '{}';
    const accessTokenContent = JSON.parse(accessTokenContentString) as TokenContent;
    return accessTokenContent?.accountId;
  }

  public get refreshToken(): string {
    return this._refreshToken;
  }

  public async withAuth<T>(fn: () => Promise<T>): Promise<T> {
    if (!this._accessToken || !this._refreshToken) {
      throw new UnauthorizedError();
    }

    try {
      return await fn();
    } catch (e: any) {
      if (e instanceof UnauthorizedError) {
        try {
          await this.refreshAccess();
          return await fn();
        } catch (e: unknown) {
          // Only reset the client if failure is in authorization
          if (e instanceof UnauthorizedError) {
            this.config.logger.error('Failed to refresh access, resetting the client now.', e);
            this.uninitialize();
          }

          throw ErrorWrapper.wrap(e);
        }
      }

      this.config.logger.error('Unexpected error occurred in withAuth()', e);
      throw ErrorWrapper.wrap(e);
    }
  }

  public async initialize(): Promise<void> {
    const accessToken = PersistenceUtil.loadValue(ACCESS_TOKEN_PERSISTENCE_KEY);
    const refreshToken = PersistenceUtil.loadValue(REFRESH_TOKEN_PERSISTENCE_KEY);
    await this.setTokenPair(accessToken, refreshToken);
  }

  public authorize(accessToken: string, refreshToken: string): void {
    PersistenceUtil.storeValue(ACCESS_TOKEN_PERSISTENCE_KEY, accessToken);
    PersistenceUtil.storeValue(REFRESH_TOKEN_PERSISTENCE_KEY, refreshToken);
    this.setTokenPair(accessToken, refreshToken);
  }

  public async uninitialize(): Promise<void> {
    PersistenceUtil.clearValue(ACCESS_TOKEN_PERSISTENCE_KEY);
    PersistenceUtil.clearValue(REFRESH_TOKEN_PERSISTENCE_KEY);
    await this.setTokenPair(null, null);
  }

  public async getCredentials(): Promise<CredentialEntity[]> {
    return this.withAuth(async () => {
      const url = `${this.baseUrl}/v1/credentials/my`;
      const response = await HttpUtil.get<{ data: Dto<CredentialEntity>[] }>(url, this.authHeaders);
      return this.deserializeCredentialsList(response.data);
    });
  }

  private setTokenPair(accessToken: string, refreshToken: string): void {
    this._accessToken = accessToken;
    this._refreshToken = refreshToken;
  }

  private async refreshAccess(): Promise<TokenPair> {
    const url = `${this.baseUrl}/v1/tokens/refresh?refreshToken=${this._refreshToken}`;
    const responseBody = await HttpUtil.post<{ data: TokenPair }>(url, null, { ...this.authHeaders });
    const tokenPair = responseBody.data;

    this.authorize(tokenPair.access, tokenPair.refresh);

    return tokenPair;
  }

  private deserializeCredentialsList(dtos: Dto<CredentialEntity>[]): CredentialEntity[] {
    return (dtos || []).map((dto) => this.deserializeCredential(dto));
  }

  private deserializeCredential(dto: Dto<CredentialEntity>): CredentialEntity {
    if (!dto) {
      return null;
    }

    return new CredentialEntity({
      id: dto.id,
      accountId: dto.accountId,
      type: dto.type,
      identifier: dto.identifier,
      data: dto.data,
      isVerified: dto.isVerified,
      createdAt: dto.createdAt ? new Date(dto.createdAt) : undefined,
      updatedAt: dto.updatedAt ? new Date(dto.updatedAt) : undefined,
      deletedAt: dto.deletedAt ? new Date(dto.deletedAt) : undefined,
    });
  }
}
