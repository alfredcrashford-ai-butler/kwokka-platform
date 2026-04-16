import { injectable, injectFromBase } from 'inversify';
import type { AccountRolesEntity } from '@kwokka/entities';
import { CrudApi } from '@/api/crud-api';
import type { Dto } from '@/api/dto';
import { AccountRolesApiAdapter } from './account-roles.api-adapter';

@injectable()
@injectFromBase()
export class AccountRolesApi extends CrudApi<AccountRolesEntity, Dto<AccountRolesEntity>> {
  protected override readonly baseUrl = '/owl/v1/account-roles';
  protected override readonly adapter = new AccountRolesApiAdapter();

  public async getByAccountId(accountId: string): Promise<AccountRolesEntity> {
    const result = await this.http.get<Dto<AccountRolesEntity>>(`${this.baseUrl}/account/${accountId}`);
    return this.adapter.deserialize(result.data);
  }
}
