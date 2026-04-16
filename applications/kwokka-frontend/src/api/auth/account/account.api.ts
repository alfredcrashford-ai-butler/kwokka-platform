import { CrudApi } from '@/api/crud-api';
import type { AccountEntity } from '@kwokka/entities';
import { injectable, injectFromBase } from 'inversify';
import { AccountApiAdapter } from './account.api-adapter';
import type { Dto } from '@/api/dto';

@injectable()
@injectFromBase()
export class AccountApi extends CrudApi<AccountEntity, Dto<AccountEntity>> {
  protected override readonly baseUrl = '/owl/v1/accounts';
  protected override readonly adapter = new AccountApiAdapter();

  public async createUser(): Promise<AccountEntity> {
    const result = await this.http.post<Dto<AccountEntity>>(`${this.baseUrl}/user`);
    return this.adapter.deserialize(result.data);
  }

  public async createApplication(): Promise<AccountEntity> {
    const result = await this.http.post<Dto<AccountEntity>>(`${this.baseUrl}/app`);
    return this.adapter.deserialize(result.data);
  }

  public async createApplicationAdmin(): Promise<AccountEntity> {
    const result = await this.http.post<Dto<AccountEntity>>(`${this.baseUrl}/app-admin`);
    return this.adapter.deserialize(result.data);
  }

  public async setActive(id: string, isActive: boolean): Promise<AccountEntity> {
    const result = await this.http.put<Dto<AccountEntity>>(`${this.baseUrl}/${id}/active`, { isActive });
    return this.adapter.deserialize(result.data);
  }
}
