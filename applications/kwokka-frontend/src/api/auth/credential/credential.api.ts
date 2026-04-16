import { injectable, injectFromBase } from 'inversify';
import type { CredentialEntity } from '@kwokka/entities';
import { CrudApi } from '@/api/crud-api';
import type { Dto } from '@/api/dto';
import { CredentialApiAdapter } from './credential.api-adapter';
import type { NetworkResponse } from '@/service/network/http.service';

@injectable()
@injectFromBase()
export class CredentialApi extends CrudApi<CredentialEntity, Dto<CredentialEntity>> {
  protected override readonly baseUrl = '/owl/v1/credentials';
  protected override readonly adapter = new CredentialApiAdapter();

  public async createOwn(entity: CredentialEntity): Promise<CredentialEntity> {
    const dto = this.adapter.serialize(entity);
    const result = await this.http.post<Dto<CredentialEntity>>(`${this.baseUrl}/my`, dto);
    return this.adapter.deserialize(result.data);
  }

  public async getOwnCredentialById(id: string): Promise<CredentialEntity> {
    const result = await this.http.get<Dto<CredentialEntity>>(`${this.baseUrl}/my/${id}`);
    return this.adapter.deserialize(result.data);
  }

  public async listOwnCredentials(offset: number, limit: number): Promise<NetworkResponse<CredentialEntity[]>> {
    const result = await this.http.get<Dto<CredentialEntity>[]>(`${this.baseUrl}/my?offset=${offset}&limit=${limit}`);
    const entities = this.adapter.deserializeList(result.data);
    return {
      data: entities,
      meta: result.meta,
    };
  }

  public async deleteOwnCredential(id: string): Promise<CredentialEntity> {
    const result = await this.http.delete<Dto<CredentialEntity>>(`${this.baseUrl}/my/${id}`);
    return this.adapter.deserialize(result.data);
  }

  public async verifyOwnCredential(credentialId: string): Promise<void> {
    await this.http.post(`${this.baseUrl}/my/${credentialId}/verify`);
  }

  public async completeVerifyOwnCredential(credentialId: string, token: string): Promise<void> {
    await this.http.post(`${this.baseUrl}/my/${credentialId}/complete-verify`, { token });
  }

  public async verifyCredential(credentialId: string): Promise<void> {
    await this.http.post(`${this.baseUrl}/${credentialId}/verify`);
  }

  public async listByAccountId(
    accountId: string,
    offset: number,
    limit: number,
  ): Promise<NetworkResponse<CredentialEntity[]>> {
    const result = await this.http.get<Dto<CredentialEntity>[]>(
      `${this.baseUrl}?accountId=${accountId}&offset=${offset}&limit=${limit}`,
    );
    const entities = this.adapter.deserializeList(result.data);
    return {
      data: entities,
      meta: result.meta,
    };
  }
}
