import { inject, injectable } from 'inversify';
import type { TokenEntity } from '@kwokka/entities';
import { TokenApiAdapter } from './token.api-adapter';
import type { TokenDto } from './token.dto';
import { HttpService, type NetworkResponse } from '@/service/network/http.service';

@injectable()
export class TokenApi {
  protected readonly baseUrl = '/owl/v1/tokens';
  protected readonly adapter = new TokenApiAdapter();

  public constructor(@inject(HttpService) private http: HttpService) {}

  public get refreshAccessUrl(): string {
    return `${this.baseUrl}/refresh`;
  }

  public async list(offset: number, limit: number): Promise<NetworkResponse<TokenEntity[]>> {
    const result = await this.http.get<TokenDto[]>(`${this.baseUrl}?offset=${offset}&limit=${limit}`);
    const entities = this.adapter.deserializeList(result.data);
    return { data: entities, meta: result.meta };
  }

  public async listByAccountId(
    accountId: string,
    offset: number,
    limit: number,
  ): Promise<NetworkResponse<TokenEntity[]>> {
    const result = await this.http.get<TokenDto[]>(
      `${this.baseUrl}?accountId=${accountId}&offset=${offset}&limit=${limit}`,
    );
    const entities = this.adapter.deserializeList(result.data);
    return { data: entities, meta: result.meta };
  }

  public async getById(id: string): Promise<TokenEntity> {
    const result = await this.http.get<TokenDto>(`${this.baseUrl}/${id}`);
    return this.adapter.deserialize(result.data);
  }

  public async revokeAccessByCorrelationId(correlationId: string): Promise<void> {
    await this.http.post<void>(`${this.baseUrl}/revoke/correlation-id/${correlationId}`);
  }

  public async revokeAccessByAccountId(accountId: string): Promise<void> {
    await this.http.post<void>(`${this.baseUrl}/revoke/account-id/${accountId}`);
  }

  public async refreshAccess(refreshToken: string): Promise<{ access: string; refresh: string }> {
    const result = await this.http.post<{ access: string; refresh: string }>(
      `${this.refreshAccessUrl}?refreshToken=${refreshToken}`,
    );
    return result.data;
  }
}
